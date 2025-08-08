import { SwarmComment } from "@solarpunkltd/swarm-comment-js";
import { useCallback } from "react";

import { useGlobalState } from "@/contexts/global";
import { getLocalPrivateKey, getSessionsByDay, getSigner } from "@/utils/helpers";

export const useCalcSpacesActivity = () => {
  const { sessions, setSpacesActivity, username } = useGlobalState();
  const beeUrl = process.env.BEE_API_URL;
  const privKey = getLocalPrivateKey();
  const userSigner = privKey ? getSigner(privKey) : null;

  const calcSpacesActivity = useCallback(async () => {
    if (!sessions || !userSigner || !beeUrl) {
      console.error("Missing required dependencies for spaces activity calculation");
      return;
    }

    const spacesSessions = getSessionsByDay(sessions, "spaces");
    try {
      const tmpActivity = new Map<string, bigint>();
      const fetchPromises: Promise<{ sessionId: string; messageCount: bigint }>[] = [];

      for (let i = 0; i < spacesSessions.length; i++) {
        const sessionId = spacesSessions[i].id;

        const config = {
          user: {
            nickname: username,
            privateKey: userSigner.toHex(),
          },
          infra: {
            beeUrl: beeUrl,
            stamp: process.env.STAMP,
            topic: sessionId,
          },
        };

        const swarmComment = new SwarmComment(config);

        const fetchPromise = new Promise<{ sessionId: string; messageCount: bigint }>((resolve, reject) => {
          swarmComment.start(true); // Start fetching messages

          let messages: any[] = [];
          const { on } = swarmComment.getEmitter();

          on("MESSAGE_RECEIVED", (message: any) => {
            messages.push(message);
          });

          on("LOADING_INIT", (loading: boolean) => {
            if (!loading) {
              // Loading complete
              swarmComment.stop();
              resolve({ sessionId, messageCount: BigInt(messages.length) });
            }
          });

          on("CRITICAL_ERROR", (error: any) => {
            swarmComment.stop();
            reject(error);
          });
        });

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
  }, [sessions, userSigner, beeUrl, username, setSpacesActivity]);

  return { calcSpacesActivity };
};
