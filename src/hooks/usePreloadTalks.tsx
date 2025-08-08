import { useCallback } from "react";

import { useGlobalState } from "@/contexts/global";
import { Session } from "@/types/session";
import { TalkComments } from "@/types/talkComment";
import { getTopic } from "@/utils/bee";
import { getSigner } from "@/utils/helpers";

export const usePreloadTalks = (recentSessions: Session[], username: string) => {
  const { loadedTalks, setLoadedTalks } = useGlobalState();
  const beeUrl = process.env.BEE_API_URL;
  const userSigner = getSigner(username);

  const preLoadTalks = useCallback(async () => {
    if (!beeUrl || !recentSessions.length) {
      return;
    }

    try {
      // Simply ensure we have placeholder entries for all recent sessions
      // The actual message loading will be handled by individual useSwarmComment hooks
      const preLoadedTalks: TalkComments[] = [];

      for (let i = 0; i < recentSessions.length; i++) {
        const sessionId = recentSessions[i].id;
        const talkId = getTopic(sessionId);

        // Check if already loaded
        if (loadedTalks) {
          const foundIx = loadedTalks.findIndex((talk) => talk.talkId === talkId);
          if (foundIx > -1) {
            preLoadedTalks.push(loadedTalks[foundIx]);
            continue;
          }
        }

        // Create placeholder entry
        preLoadedTalks.push({
          talkId,
          messages: [], // Will be populated by useSwarmComment hooks
        });
      }

      setLoadedTalks(preLoadedTalks.length > 0 ? preLoadedTalks : undefined);
    } catch (error) {
      console.error("preloading talks error: ", error);
    }
  }, [recentSessions, loadedTalks, beeUrl, userSigner, setLoadedTalks]);

  return { preLoadTalks };
};
