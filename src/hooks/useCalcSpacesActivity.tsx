// import { SwarmComment } from "@solarpunkltd/swarm-comment-js";
import { useCallback } from "react";

import { useGlobalState } from "@/contexts/global";
import { getLocalPrivateKey, getSessionsByDay } from "@/utils/helpers";
import { getTopic } from "@/utils/bee";
import { useSwarmComment } from "./useSwarmComment";
import { CommentSettings } from "@solarpunkltd/swarm-comment-js";

export const useCalcSpacesActivity = (settings: CommentSettings) => {
  const { sessions, setSpacesActivity, username } = useGlobalState();

  const calcSpacesActivity = useCallback(async () => {
    const spacesSessions = getSessionsByDay(sessions, "spaces");
    try {
      const tmpActivity = new Map<string, bigint>();
      const fetchPromises: Promise<{ sessionId: string; messageCount: bigint }>[] = [];

      for (let i = 0; i < spacesSessions.length; i++) {
        const sessionId = spacesSessions[i].id;
        const talkId = getTopic(sessionId);
        settings.infra.topic = talkId;
        const swarmCommentHook = useSwarmComment(settings);
        const { fetchPreviousMessages } = swarmCommentHook;

        if (!fetchPreviousMessages) {
          console.error(`Cannot fetch previous messages for spaces talkId: ${talkId}`);
          continue;
        }

        const fetchResult = fetchPreviousMessages();
        if (!fetchResult) {
          console.error(`fetchPreviousMessages returned undefined for spaces talkId: ${talkId}`);
          continue;
        }

        const fetchPromise = fetchResult.then(() => ({
          sessionId: sessionId,
          messageCount: BigInt(swarmCommentHook.allMessages.length),
        }));

        fetchPromises.push(fetchPromise);
      }

      const results = await Promise.allSettled(fetchPromises);

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          tmpActivity.set(result.value.sessionId, BigInt(result.value.messageCount));
        } else {
          console.error(`fetching user count of talks error: `, result.reason);
        }
      });

      setSpacesActivity(tmpActivity);
    } catch (error) {
      console.error("fetching user count of talks error: ", error);
    }
  }, []);

  return { calcSpacesActivity };
};
