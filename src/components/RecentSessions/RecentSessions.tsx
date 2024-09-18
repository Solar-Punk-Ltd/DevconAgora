import React from "react";
import { useEffect, useState } from "react";
import "./RecentSessions.scss";
import { Link } from "react-router-dom";
import RecentSessionsItem from "./RecentSessionsItem/RecentSessionsItem";
import { Session } from "../../types/session";
import { FIVE_MINNUTES, ROUTES, STAGES_MAP } from "../../utils/constants";
import { shortenTitle } from "../../utils/helpers";

const mockStartTime = new Date("2022-10-12T10:00:00.000Z").getTime();

interface SessionBoxProps {
  sessions: Session[];
  maxSessionsShown?: number;
}

const RecentSessions: React.FC<SessionBoxProps> = ({
  sessions,
  maxSessionsShown = 9,
}) => {
  const [recentSessionsItems, setRecentSessionsItems] = useState<JSX.Element[]>(
    []
  );
  const [sessionIndex, setSessionIndex] = useState<number>(0);
  const [time, setTime] = useState<number>(mockStartTime);

  function findSlotStartIx(startIx: number) {
    for (let i = startIx; i < sessions.length; i++) {
      const slotStart = sessions[i].slot_start;
      if (slotStart && new Date(slotStart).getTime() > time) {
        return i > 0 ? i - 1 : 0;
      }
    }
    return -1;
  }
  // the uploaded sessions are already sorted by time
  // find the first session that starts after the current time
  const filterRecentSessions = () => {
    const mostRecentSessions = new Array<JSX.Element>(maxSessionsShown);
    let firstSessionIx = findSlotStartIx(sessionIndex);
    firstSessionIx =
      firstSessionIx === -1
        ? sessionIndex > maxSessionsShown
          ? sessionIndex
          : maxSessionsShown
        : firstSessionIx;

    for (
      let i = 0;
      i < maxSessionsShown && 0 < sessions.length - firstSessionIx - i;
      i++
    ) {
      const recentIx = firstSessionIx - i;
      const shortTitle = shortenTitle(sessions[recentIx].title, 40);
      const room = sessions[recentIx].slot_roomId || "No room";
      const activeVisitors = Math.floor(Math.random() * 100);
      mostRecentSessions[i] = (
        <RecentSessionsItem
          key={sessions[recentIx].id}
          title={shortTitle}
          stage={STAGES_MAP.get(room)}
          activeVisitors={activeVisitors}
        />
      );
    }
    setSessionIndex(firstSessionIx);
    setRecentSessionsItems(mostRecentSessions);
  };

  useEffect(() => {
    // TODO: what shall be the update time ?
    const sessionUpdateInterval = FIVE_MINNUTES;
    const interval = setInterval(async () => {
      // TODO: remove this: increase current time by 10 minutes to see the change in recent sessions
      setTime((time) => new Date(time + FIVE_MINNUTES).getTime());
    }, sessionUpdateInterval);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sessions.length != 0) {
      filterRecentSessions();
    }
  }, [sessions, time]);

  return (
    <div>
      <div className="recent-sessions">
        <div style={{}} className="recent-sessions__title">
          Recent sessions
        </div>
        <Link to={ROUTES.AGENDA}>
          <div className="recent-sessions__all">All sessions</div>
        </Link>
      </div>
      <div className="recent-sessions__item-container">
        {recentSessionsItems.length === 0 ? (
          <RecentSessionsItem key={"no-session"} title={"No recent session"} />
        ) : (
          recentSessionsItems
        )}
      </div>
    </div>
  );
};

export default RecentSessions;
