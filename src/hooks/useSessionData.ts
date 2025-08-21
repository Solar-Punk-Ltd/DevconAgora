import { useCallback, useEffect, useState } from "react";

import { useGlobalState } from "../contexts/global";
import { Session } from "../types/session";
import { getFeedUpdate } from "../utils/bee";
import { ALL_SESSIONS_KEY, CATEGORIES, FIVE_MINUTES, MAX_SESSIONS_SHOWN, RAW_FEED_TOPIC_SESSIONS, SPACES_KEY } from "../utils/constants";
import { findSlotStartIx, getSessionsByDay } from "../utils/helpers";

export const useSessionData = (isBeeRunning: boolean) => {
  const { setSessions, setRecentSessions } = useGlobalState();
  const [recentSessionIx, setRecentSessionIx] = useState<number>(0);
  const [time, setTime] = useState<number>(new Date().getTime());

  const fetchFeedUpdate = useCallback(async () => {
    if (isBeeRunning) {
      // TODO: unnecessary payload.tostring() then back to json
      const sessionDataStr = await getFeedUpdate(process.env.FEED_OWNER_ADDRESS as string, RAW_FEED_TOPIC_SESSIONS);
      const sessionData = new Map<string, Session[]>(Object.entries(JSON.parse(sessionDataStr)));

      const spacesSessions: Session[] = [];
      for (let i = 0; i < CATEGORIES.length; i++) {
        const cat = CATEGORIES[i];
        spacesSessions.push({
          id: cat,
          sourceId: cat,
          title: cat,
          track: cat,
          slot_start: new Date().toLocaleString(),
          slot_end: new Date().toLocaleString(),
          slot_roomId: cat,
        });
      }
      // todo: spaces can be separate from global session -> optimize performance
      sessionData.set(SPACES_KEY, spacesSessions);
      if (sessionData.size !== 0) {
        console.debug("session data updated");
        setSessions(sessionData);
      } else {
        console.debug("session data empty");
      }
    }
  }, [isBeeRunning, setSessions]);

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
    [time, setRecentSessions]
  );

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
