import { useCallback } from "react";

import { useGlobalState } from "@/contexts/global";
import { FeedIndex } from "@ethersphere/bee-js";

export const useCalcTalkActivity = () => {
  const { loadedTalks, setTalkActivity, recentSessions } = useGlobalState();

  const calcTalkActivity = useCallback(async () => {
    if (loadedTalks && recentSessions) {
      const tmpActiveVisitors = new Map<string, bigint>();
      for (let i = 0; i < recentSessions.length; i++) {
        const foundIx = loadedTalks.findIndex((talk) => talk.talkId.includes(recentSessions[i].id));
        if (foundIx > -1) {
          const messageCount = new FeedIndex(loadedTalks[foundIx].messages[-1].index).toBigInt();
          tmpActiveVisitors.set(recentSessions[i].id, messageCount);
        }
      }
      setTalkActivity(tmpActiveVisitors);
    }
  }, [loadedTalks, recentSessions, setTalkActivity]);

  return { calcTalkActivity };
};
