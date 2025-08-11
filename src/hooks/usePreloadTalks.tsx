import { useCallback } from "react";

import { useGlobalState } from "@/contexts/global";
import { Session } from "@/types/session";
import { TalkComments } from "@/types/talkComment";
import { getTopic } from "@/utils/bee";
import { getLocalPrivateKey } from "@/utils/helpers";
import { PrivateKey } from "@ethersphere/bee-js";
import { CommentSettings } from "@solarpunkltd/swarm-comment-js";
import { useSwarmComment } from "./useSwarmComment";

export const usePreloadTalks = (settings: CommentSettings) => {
  const { loadedTalks, setLoadedTalks, recentSessions } = useGlobalState();
  const beeUrl = process.env.BEE_API_URL;

  const privKey = getLocalPrivateKey();
  if (!privKey || privKey.length !== PrivateKey.LENGTH * 2) {
    console.error("Private key not found");
    return null;
  }

  const userSigner = new PrivateKey(privKey);

  const preLoadTalks = useCallback(async () => {
    if (!beeUrl || !recentSessions.length) {
      return;
    }

    try {
      const preLoadedTalks: TalkComments[] = [];
      const fetchPromises: Promise<{ talkId: string; messages: any[] }>[] = [];

      for (let i = 0; i < recentSessions.length; i++) {
        const talkId = getTopic(recentSessions[i].id);

        // only load the talks that are not already loaded
        if (loadedTalks) {
          // talkids include a "version" suffix
          // todo: .find(talkId)
          const foundIx = loadedTalks.findIndex((talk) => talk.talkId.includes(talkId));
          if (foundIx > -1) {
            preLoadedTalks.push(loadedTalks[foundIx]);
            continue;
          }
        }

        settings.infra.topic = talkId;
        const swarmCommentHook = useSwarmComment(settings, false);
        const { fetchPreviousMessages } = swarmCommentHook;

        if (!fetchPreviousMessages) {
          console.error(`Cannot fetch previous messages for talkId: ${talkId}`);
          continue;
        }

        const fetchResult = fetchPreviousMessages();
        if (!fetchResult) {
          console.error(`fetchPreviousMessages returned undefined for talkId: ${talkId}`);
          continue;
        }

        const fetchPromise = fetchResult.then(() => ({
          talkId,
          messages: swarmCommentHook.allMessages,
        }));

        fetchPromises.push(fetchPromise);
      }

      const results = await Promise.allSettled(fetchPromises);

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          preLoadedTalks.push({
            talkId: result.value.talkId,
            messages: result.value.messages,
          });
        } else {
          console.error("preloading talks error: ", result.reason);
        }
      });

      setLoadedTalks(preLoadedTalks.length > 0 ? preLoadedTalks : undefined);
    } catch (error) {
      console.error("preloading talks error: ", error);
    }
  }, [recentSessions, loadedTalks, beeUrl, userSigner, setLoadedTalks]);

  return { preLoadTalks };
};
