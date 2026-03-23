import { useCallback, useEffect, useState } from "react";

import { ALL_SESSIONS_KEY, FIVE_MINUTES, MAX_SESSIONS_SHOWN } from "../constants/app";
import { RAW_FEED_TOPIC_SESSIONS } from "../constants/network";
import { useGlobalState } from "../contexts/global";
import { Session } from "../types/session";
import { getFeedUpdate } from "../utils/bee";
import { swarmIdGetFeedUpdate } from "../utils/swarmId";

import { useUserContext } from "@/contexts/user";
import { getSessionsByDay } from "@/utils/session";
import { Topic } from "@ethersphere/bee-js";

export const useSessionData = (isBeeRunning: boolean) => {
  const { setSessions, setRecentSessions } = useGlobalState();
  const { isSwarmEnabled, swarmClient } = useUserContext();
  const [recentSessionIx, setRecentSessionIx] = useState<number>(0);
  const [time, setTime] = useState<number>(new Date().getTime());

  const filterRecentSessions = useCallback(
    (sessions: Map<string, Session[]>) => {
      const day = ALL_SESSIONS_KEY;
      const sessionsByDay = getSessionsByDay(sessions, day);
      if (sessionsByDay.length != 0) {
        const mostRecentSessions = new Array<Session>(MAX_SESSIONS_SHOWN);
        let firstSessionIx = findSlotStartIx(recentSessionIx, sessionsByDay, time);
        firstSessionIx = firstSessionIx > MAX_SESSIONS_SHOWN - 1 ? firstSessionIx : MAX_SESSIONS_SHOWN - 1;

        for (let i = 0; i < MAX_SESSIONS_SHOWN && 0 < sessionsByDay.length - firstSessionIx - i; i++) {
          const recentIx = firstSessionIx - i;
          mostRecentSessions[i] = sessionsByDay[recentIx];
        }
        setRecentSessionIx(firstSessionIx);

        setRecentSessions(mostRecentSessions);
      }
    },
    [recentSessionIx, time, setRecentSessions]
  );

  const fetchFeedUpdate = useCallback(async () => {
    try {
      if (isBeeRunning) {
        let sessionDataStr = "";

        if (isSwarmEnabled && swarmClient && false) {
          const topicHex = Topic.fromString(RAW_FEED_TOPIC_SESSIONS).toString();
          // Phase 3: Use SwarmIdClient to read public feed
          sessionDataStr = await swarmIdGetFeedUpdate(
            swarmClient!,
            topicHex,
            process.env.FEED_OWNER_ADDRESS,
          );
        } else {
          // Legacy path: Use Bee SDK directly
          sessionDataStr = await getFeedUpdate(process.env.FEED_OWNER_ADDRESS as string, RAW_FEED_TOPIC_SESSIONS, false);
        }
        
        let sessionData: Map<string, Session[]> = new Map();
        if (sessionDataStr.length > 0) {
          sessionData = new Map<string, Session[]>(Object.entries(JSON.parse(sessionDataStr)));
        }

        if (sessionData.size !== 0) {
          console.debug("session data updated");
          setSessions(sessionData);
          // Automatically filter recent sessions when new session data is fetched
          filterRecentSessions(sessionData);
        } else {
          console.debug("session data empty");
        }
      } 
    } catch (ex) {
      debugger;
    }
  }, [isBeeRunning, setSessions, filterRecentSessions, isSwarmEnabled, swarmClient]);

  useEffect(() => {
    fetchFeedUpdate();
    const interval = setInterval(async () => {
      fetchFeedUpdate();
    }, FIVE_MINUTES);

    return () => clearInterval(interval);
  }, [fetchFeedUpdate]);

  useEffect(() => {
    const interval = setInterval(async () => {
      setTime(new Date().getTime());
    }, FIVE_MINUTES);

    return () => clearInterval(interval);
  }, []);

  return { filterRecentSessions };
};

const findSlotStartIx = (startIx: number, sessionsByDay: Session[], time: number): number => {
  for (let i = startIx; i < sessionsByDay.length; i++) {
    const slotStart = sessionsByDay[i].slot_start;
    if (slotStart && new Date(slotStart).getTime() > time) {
      return i > 0 ? i - 1 : 0;
    }
  }
  return -1;
};
