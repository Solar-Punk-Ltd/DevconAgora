import { getPrivateKeyFromIdentifier, MessageData } from "@solarpunkltd/comment-system";
import { loadLatestComments } from "@solarpunkltd/comment-system-ui";
import { useCallback } from "react";

import { useGlobalState } from "@/contexts/global";
import { TalkComments } from "@/types/talkComment";
import { getTopic } from "@/utils/bee";
import { DEFAULT_URL, MAX_COMMENTS_LOADED, SPACES_KEY } from "@/utils/constants";
import { getActivityHelper, getSessionsByDay } from "@/utils/helpers";
// TODO: will be refactored later, works for now
export const usePreloadTalks = () => {
  const { recentSessions, loadedTalks, setLoadedTalks, setTalkActivity, sessions, setSpacesActivity } = useGlobalState();

  const calcActivity = useCallback(async (): Promise<void> => {
    if (loadedTalks) {
      const tmpActiveVisitors = new Map<string, number>();
      for (let i = 0; i < recentSessions.length; i++) {
        const foundIx = loadedTalks.findIndex((talk) => talk.talkId.includes(recentSessions[i].id));
        if (foundIx > -1) {
          const activity = Number(getActivityHelper(loadedTalks[foundIx].messages, true));
          tmpActiveVisitors.set(recentSessions[i].id, activity);
        }
      }
      setTalkActivity(tmpActiveVisitors);
    }
  }, [loadedTalks, recentSessions, setTalkActivity]);

  const calcSpacesActivity = useCallback(async (): Promise<void> => {
    const spacesSessions = getSessionsByDay(sessions, SPACES_KEY);
    const spacesPromises: Promise<MessageData[]>[] = [];
    const preLoadedTalks: TalkComments[] = [];
    const talkIds: string[] = [];
    try {
      for (let i = 0; i < spacesSessions.length; i++) {
        const rawTalkTopic = getTopic(spacesSessions[i].id);
        const signer = getPrivateKeyFromIdentifier(rawTalkTopic);
        spacesPromises.push(
          loadLatestComments(rawTalkTopic, signer.publicKey().address().toString(), process.env.BEE_API_URL || DEFAULT_URL, MAX_COMMENTS_LOADED)
        );

        talkIds.push(rawTalkTopic);
      }

      const activityMap = new Map<string, number>();
      await Promise.allSettled(spacesPromises).then((results) => {
        results.forEach((result, i) => {
          if (result.status === "fulfilled") {
            const activity = Number(getActivityHelper(result.value, true));
            activityMap.set(spacesSessions[i].id, activity);

            preLoadedTalks.push({
              talkId: talkIds[i],
              messages: result.value,
            });
          } else {
            console.error(`fetching user count of talks error: `, result.reason);
          }
        });
      });

      setLoadedTalks(preLoadedTalks);
      setSpacesActivity(activityMap);
    } catch (error) {
      console.error("fetching user count of talks error: ", error);
    }
  }, [sessions, setLoadedTalks, setSpacesActivity]);

  return { calcActivity, calcSpacesActivity };
};
