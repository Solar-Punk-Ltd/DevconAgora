import { useCallback } from "react";

import { useGlobalState } from "@/contexts/global";
import { TalkComments } from "@/types/talkComment";
import { getTopic } from "@/utils/bee";
import { FeedIndex } from "@ethersphere/bee-js";
import { CommentSettings } from "@solarpunkltd/swarm-comment-js";
import { VisibleMessage } from "./useSwarmComment";
import { getPrivateKeyFromIdentifier, Options, readCommentsInRange, readSingleComment } from "@solarpunkltd/comment-system";
import { CATEGORIES, FEED_INDEX_ZERO, MAX_COMMENTS_LOADED, SPACES_KEY } from "@/utils/constants";
import { getSessionsByDay } from "@/utils/helpers";

// TODO: reaction state handling
export const usePreloadTalks = (settings: CommentSettings) => {
  const { loadedTalks, setLoadedTalks, recentSessions, sessions, setSpacesActivity, setTalkActivity } = useGlobalState();
  const spacesSessions = getSessionsByDay(sessions, SPACES_KEY);
  const mergedSessions = [...spacesSessions, ...recentSessions];

  const preLoadTalks = useCallback(async () => {
    try {
      const tmpSpacesActivity = new Map<string, bigint>();
      const tmpTalkActivity = new Map<string, bigint>();
      const preLoadedTalks: TalkComments[] = [];
      const commentPromises: Promise<VisibleMessage[] | undefined>[] = [];
      const talkIds: string[] = [];
      const sessionIds: string[] = [];

      for (let i = 0; i < mergedSessions.length; i++) {
        const sessionId = mergedSessions[i].id;
        const talkId = getTopic(sessionId);

        if (loadedTalks) {
          const foundIx = loadedTalks.findIndex((t) => t.talkId === talkId);
          if (foundIx > -1) {
            preLoadedTalks.push(loadedTalks[foundIx]);
            continue;
          }
        }

        settings.infra.topic = talkId;
        const signer = getPrivateKeyFromIdentifier(settings.infra.topic);
        const options: Options = {
          identifier: talkId,
          address: signer.publicKey().address().toString(),
          beeApiUrl: settings.infra.beeUrl,
        };
        const latest = await readSingleComment(undefined, options);

        if (!latest?.nextIndex || new FeedIndex(latest.nextIndex) === FEED_INDEX_ZERO) {
          console.log(`No latest comment found for talkId: ${talkId}`);
          continue;
        }
        const latestIx = new FeedIndex(latest.nextIndex).toBigInt();
        const startIx = latestIx > MAX_COMMENTS_LOADED ? latestIx - MAX_COMMENTS_LOADED : 0n;
        const cp = readCommentsInRange(FeedIndex.fromBigInt(startIx), FeedIndex.fromBigInt(latestIx), options);

        commentPromises.push(cp);
        talkIds.push(talkId);
        sessionIds.push(sessionId);
      }

      const results = await Promise.allSettled(commentPromises);

      results.forEach((result, i) => {
        if (result.status === "fulfilled") {
          if (!result.value) {
            console.error(`preloading talks: invalid comments found for talkId: ${talkIds[i]}`);
            return;
          }

          const messages = [...result.value];

          const isSpacesSession = CATEGORIES.find((c) => c === sessionIds[i]);
          const latestIx = new FeedIndex(messages[messages.length - 1].index).toBigInt();
          if (isSpacesSession) {
            tmpSpacesActivity.set(sessionIds[i], latestIx);
          } else {
            tmpTalkActivity.set(talkIds[i], latestIx);
          }

          for (const message of messages) {
            message.received = true;
          }

          preLoadedTalks.push({
            talkId: talkIds[i],
            messages,
          });
        } else {
          console.log(`preloading talks error: `, result.reason);
        }
      });

      // TODO: why undef ? can be []
      setSpacesActivity(tmpSpacesActivity);
      setTalkActivity(tmpTalkActivity);
      setLoadedTalks(preLoadedTalks.length > 0 ? preLoadedTalks : undefined);
    } catch (error) {
      console.log("preloading talks error: ", error);
    }
  }, [recentSessions, sessions, loadedTalks, setLoadedTalks]);

  return { preLoadTalks };
};
