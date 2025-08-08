import { useCallback } from "react";

import { useGlobalState } from "@/contexts/global";

export const useCalcActivity = () => {
  const { loadedTalks, setTalkActivity, recentSessions } = useGlobalState();

  const calcActivity = useCallback(async () => {
    if (loadedTalks && recentSessions) {
      const tmpActiveVisitors = new Map<string, bigint>();
      for (let i = 0; i < recentSessions.length; i++) {
        const foundIx = loadedTalks.findIndex((talk) => talk.talkId.includes(recentSessions[i].id));
        if (foundIx > -1) {
          tmpActiveVisitors.set(recentSessions[i].id, BigInt(loadedTalks[foundIx].messages.length));
        }
      }
      setTalkActivity(tmpActiveVisitors);
    }
  }, [loadedTalks, recentSessions, setTalkActivity]);

  return { calcActivity };
};
