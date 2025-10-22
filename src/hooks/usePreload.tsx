import { FeedIndex, PrivateKey, Topic } from "@ethersphere/bee-js";
import { getPrivateKeyFromIdentifier, MessageData, Options, readCommentsInRange, readSingleComment } from "@solarpunkltd/comment-system";
import { indexStrToBigint } from "@solarpunkltd/swarm-comment-js";
import { useCallback } from "react";

import { MAX_COMMENTS_LOADED, MAX_PRELOADED_TALKS } from "@/constants/app";
import { DEFAULT_URL } from "@/constants/network";
import { useGlobalState } from "@/contexts/global";
import { Session } from "@/types/session";
import { Space } from "@/types/space";
import { TalkComments } from "@/types/talkComment";
import { getTopic } from "@/utils/bee";
import { determineActivityNumByMessage } from "@/utils/session";

const loadFeedItems = async (signer: PrivateKey, talkId: string, address: string, beeApiUrl: string, maxComments: bigint): Promise<MessageData[]> => {
  const options: Options = {
    identifier: Topic.fromString(talkId).toString(),
    address,
    beeApiUrl,
    signer,
  };

  const latestComment = await readSingleComment(undefined, options);
  const latestIx = indexStrToBigint(latestComment?.index);
  if (!latestComment || latestIx === undefined) {
    return [];
  }

  const startIx = latestIx > maxComments ? latestIx - maxComments : 0n;

  const messages = await readCommentsInRange(FeedIndex.fromBigInt(startIx), FeedIndex.fromBigInt(latestIx), options);

  if (!messages) {
    console.debug(`preloading talks: no comments found for talkId: ${talkId}`);
    return [];
  }

  return messages;
};

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
          const talkId = getTopic(itemsToProcess[i].id);

          const signer = getPrivateKeyFromIdentifier(talkId);
          promises.push(
            loadFeedItems(signer, talkId, signer.publicKey().address().toString(), process.env.BEE_API_URL || DEFAULT_URL, MAX_COMMENTS_LOADED)
          );

          talkIds.push(talkId);
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
              console.debug(`fetching user count error: `, result.reason);
            }
          });
        });

        setLoadedItems(preLoadedItems);
        setActivity(activityMap);
      } catch (error) {
        console.debug("fetching user count error: ", error);
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
