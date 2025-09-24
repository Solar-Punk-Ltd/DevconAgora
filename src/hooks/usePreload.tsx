import { getPrivateKeyFromIdentifier, MessageData } from "@solarpunkltd/comment-system";
import { loadLatestComments } from "@solarpunkltd/comment-system-ui";
import { useCallback } from "react";

import { MAX_COMMENTS_LOADED, MAX_PRELOADED_TALKS } from "@/constants/app";
import { DEFAULT_URL } from "@/constants/network";
import { useGlobalState } from "@/contexts/global";
import { Session } from "@/types/session";
import { Space } from "@/types/space";
import { TalkComments } from "@/types/talkComment";
import { getTopic } from "@/utils/bee";
import { determineActivityNumByMessage } from "@/utils/session";

export const usePreload = () => {
  const { setLoadedSpaces, setSpacesActivity, spaces, recentSessions, setLoadedTalks, setTalkActivity } = useGlobalState();

  const calcActivity = useCallback(
    async (
      items: (Session | Space)[],
      maxItems: number,
      setLoadedItems: (items: TalkComments[]) => void,
      setActivity: (activity: Map<string, number>) => void
    ): Promise<void> => {
      const promises: Promise<MessageData[]>[] = [];
      const preLoadedItems: TalkComments[] = [];
      const talkIds: string[] = [];

      try {
        const itemsToProcess = items.slice(0, maxItems);

        for (let i = 0; i < itemsToProcess.length; i++) {
          const rawTalkTopic = getTopic(itemsToProcess[i].id);
          const signer = getPrivateKeyFromIdentifier(rawTalkTopic);
          promises.push(
            loadLatestComments(rawTalkTopic, signer.publicKey().address().toString(), process.env.BEE_API_URL || DEFAULT_URL, MAX_COMMENTS_LOADED)
          );

          talkIds.push(rawTalkTopic);
        }

        const activityMap = new Map<string, number>();
        await Promise.allSettled(promises).then((results) => {
          results.forEach((result, i) => {
            if (result.status === "fulfilled") {
              const activity = Number(determineActivityNumByMessage(result.value, true));
              activityMap.set(itemsToProcess[i].id, activity);

              preLoadedItems.push({
                talkId: talkIds[i],
                messages: result.value,
              });
            } else {
              console.error(`fetching user count error: `, result.reason);
            }
          });
        });

        setLoadedItems(preLoadedItems);
        setActivity(activityMap);
      } catch (error) {
        console.error("fetching user count error: ", error);
      }
    },
    []
  );

  const calcSpacesActivity = useCallback(async (): Promise<void> => {
    return calcActivity(spaces, spaces.length, setLoadedSpaces, setSpacesActivity);
  }, [spaces, setLoadedSpaces, setSpacesActivity, calcActivity]);

  const calcTalksActivity = useCallback(async (): Promise<void> => {
    return calcActivity(recentSessions, MAX_PRELOADED_TALKS, setLoadedTalks, setTalkActivity);
  }, [recentSessions, setLoadedTalks, setTalkActivity, calcActivity]);

  return { calcTalksActivity, calcSpacesActivity };
};
