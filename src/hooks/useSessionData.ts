import { useCallback, useEffect, useState } from "react";

import { useGlobalState } from "../contexts/global";
import { Session } from "../types/session";
import { getFeedUpdate } from "../utils/bee";
import { FIVE_MINUTES, MAX_SESSIONS_SHOWN, RAW_FEED_TOPIC_SESSIONS } from "../utils/constants";
import { findSlotStartIx, getSessionsByDay, mapSessionFromPretalxSlot } from "../utils/helpers";
import { PretalxTalkSlot } from "@/types/pretalx";

export const useSessionData = (isBeeRunning: boolean) => {
  const { setSessions, setRecentSessions } = useGlobalState();
  const [recentSessionIx, setRecentSessionIx] = useState<number>(0);
  const [time, setTime] = useState<number>(new Date().getTime());

  const filterRecentSessions = useCallback(
    (sessions: Map<string, Session[]>) => {
      const day = "all";
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
    if (isBeeRunning) {
      // TODO: unnecessary payload.tostring() then back to json
      const sessionDataStr = await getFeedUpdate(process.env.FEED_OWNER_ADDRESS as string, RAW_FEED_TOPIC_SESSIONS, false);
      let sessionData: Map<string, Session[]> = new Map();
      const pretalxSessions: [string, PretalxTalkSlot[]][] = Object.entries(JSON.parse(sessionDataStr));
      const sessions: [string, Session[]][] = [];
      pretalxSessions.forEach((pretalxSession) => {
        sessions.push([pretalxSession[0], pretalxSession[1].map((item: PretalxTalkSlot) => mapSessionFromPretalxSlot(item) as Session)]);
      });

      if (sessionDataStr.length > 0) {
        sessionData = new Map<string, Session[]>(sessions);
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
  }, [isBeeRunning, setSessions, filterRecentSessions]);

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
