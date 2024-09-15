import React from "react";
import { useEffect, useState } from "react";
import "./RecentSessions.scss";
import { Link } from "react-router-dom";
import RecentSessionsItem from "./RecentSessionsItem/RecentSessionsItem";
import { Session } from "../../types/session";

interface SessionBoxProps {
  sessions: Session[];
  maxNumOfSessions?: number;
}

const RecentSessions: React.FC<SessionBoxProps> = ({
  sessions,
  maxNumOfSessions = 9,
}) => {
  const [recentSessions, setRecentSessions] = useState<JSX.Element[]>([]);
  const [sessionIndex, setSessionIndex] = useState<number>(0);
  const [time, setTime] = useState<number>(0);

  const createRingBuffer = (
    arr: JSX.Element[],
    startIx: number,
    length: number
  ) => {
    let index = startIx;
    const buffer = arr.slice();

    return {
      getItem: (key: number) => {
        return buffer[key];
      },
      push: (item: JSX.Element) => {
        buffer[index] = item;
        index = (length + index + 1) % length;
        return index;
      },
      get: () => {
        return buffer;
      },
    };
  };

  // TODO: sort sessions by activity or by time
  function getCurrentTime() {
    setTime(new Date().getTime());
  }

  const filterRecentSessions = () => {
    if (sessions.length != 0) {
      const ringBuffer = createRingBuffer(
        recentSessions,
        sessionIndex,
        maxNumOfSessions
      );
      let ix = sessionIndex;
      for (
        let i = 0;
        i < maxNumOfSessions && i < sessions.length - maxNumOfSessions;
        i++
      ) {
        const slotStart = new Date(sessions[i].slot_start).getTime();
        if (slotStart < time) {
          ix = ringBuffer.push(
            <RecentSessionsItem
              key={sessions[i].id}
              title={sessions[i].title}
              stage={sessions[i].slot_roomId}
              activeVisitors={110}
            />
          );
        }
      }
      setSessionIndex(ix);
      setRecentSessions(ringBuffer.get());
    }
  };

  useEffect(() => {
    getCurrentTime();
    const sessionUpdateInterval = 5000; // 5 seconds
    const interval = setInterval(async () => {
      getCurrentTime();
    }, sessionUpdateInterval);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterRecentSessions();
  }, [sessions, time]);

  return (
    <div>
      <div className="recent-sessions">
        <div style={{}} className="recent-sessions__title">
          Recent sessions
        </div>
        <Link to="/recent">
          <div className="recent-sessions__all">All sessions</div>
        </Link>
      </div>
      <div className="recent-sessions__item-container">
        {recentSessions.length === 0 ? (
          <RecentSessionsItem key={"no-session"} title={"No recent session"} />
        ) : (
          recentSessions
        )}
      </div>
    </div>
  );
};

export default RecentSessions;
