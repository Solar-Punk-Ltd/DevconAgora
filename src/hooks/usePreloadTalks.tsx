import { PrivateKey } from "@ethersphere/bee-js";
import { MessageData } from "@solarpunkltd/comment-system";
import { loadLatestComments } from "@solarpunkltd/comment-system-ui";
import { useCallback } from "react";

import { useGlobalState } from "@/contexts/global";
import { TalkComments } from "@/types/talkComment";
import { getTopic } from "@/utils/bee";
import { MAX_COMMENTS_LOADED, SPACES_KEY } from "@/utils/constants";
import { getSessionsByDay } from "@/utils/helpers";

export const usePreloadTalks = () => {
  const { recentSessions, loadedTalks, setLoadedTalks, setTalkActivity, sessions, setSpacesActivity } = useGlobalState();

  const preLoadTalks = useCallback(async (): Promise<void> => {
    try {
      const preLoadedTalks: TalkComments[] = [];
      const commentPromises: Promise<{ talkId: string; messages: any[] }>[] = [];
      const talkIds: string[] = [];
      for (let i = 0; i < recentSessions.length; i++) {
        const sessionId = recentSessions[i].id;
        const rawTalkTopic = getTopic(sessionId);
        const signer = new PrivateKey(rawTalkTopic);
        if (loadedTalks) {
          const foundIx = loadedTalks.findIndex((talk) => talk.talkId.includes(rawTalkTopic));
          if (foundIx > -1) {
            preLoadedTalks.push(loadedTalks[foundIx]);
            continue;
          }
        }
        commentPromises.push(loadLatestComments(rawTalkTopic, signer.publicKey().address.toString(), process.env.BEE_API_URL, MAX_COMMENTS_LOADED));
        talkIds.push(rawTalkTopic);
      }

      await Promise.allSettled(commentPromises).then((results) => {
        results.forEach((result, i) => {
          if (result.status === "fulfilled") {
            preLoadedTalks.push({
              talkId: talkIds[i],
              messages: result.value.messages,
            });
          } else {
            console.debug(`preloading talks error: `, result.reason);
          }
        });
      });

      setLoadedTalks(preLoadedTalks.length > 0 ? preLoadedTalks : undefined);
    } catch (error) {
      console.debug("preloading talks error: ", error);
    }
  }, [recentSessions, loadedTalks, setLoadedTalks]);

  const calcActivity = useCallback(async (): Promise<void> => {
    if (loadedTalks) {
      const tmpActiveVisitors = new Map<string, number>();
      for (let i = 0; i < recentSessions.length; i++) {
        const foundIx = loadedTalks.findIndex((talk) => talk.talkId.includes(recentSessions[i].id));
        if (foundIx > -1) {
          tmpActiveVisitors.set(recentSessions[i].id, loadedTalks[foundIx].messages?.length ?? 0);
        }
      }
      setTalkActivity(tmpActiveVisitors);
    }
  }, [loadedTalks, recentSessions, setTalkActivity]);

  const calcSpacesActivity = useCallback(async (): Promise<void> => {
    const spacesSessions = getSessionsByDay(sessions, SPACES_KEY);
    const spacesPromises: Promise<{ talkId: string; messages: MessageData[] }>[] = [];
    try {
      for (let i = 0; i < spacesSessions.length; i++) {
        const rawTalkTopic = getTopic(spacesSessions[i].id);
        const signer = new PrivateKey(rawTalkTopic);
        spacesPromises.push(loadLatestComments(rawTalkTopic, signer.publicKey().address.toString(), process.env.BEE_API_URL, MAX_COMMENTS_LOADED));
      }

      const tmpActivity = new Map<string, number>();
      await Promise.allSettled(spacesPromises).then((results) => {
        results.forEach((result, i) => {
          if (result.status === "fulfilled") {
            tmpActivity.set(spacesSessions[i].id, result.value.messages.length);
          } else {
            console.error(`fetching user count of talks error: `, result.reason);
          }
        });
      });
      setSpacesActivity(tmpActivity);
    } catch (error) {
      console.error("fetching user count of talks error: ", error);
    }
  }, [sessions, setSpacesActivity]);

  return { preLoadTalks, calcActivity, calcSpacesActivity };
};
