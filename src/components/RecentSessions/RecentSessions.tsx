import React from "react";
import { Link } from "react-router-dom";
import "./RecentSessions.scss";
import RecentSessionsItem from "./RecentSessionsItem/RecentSessionsItem";
import { useGlobalState } from "../../GlobalStateContext";
import { ROUTES, STAGES_MAP } from "../../utils/constants";

const RecentSessions: React.FC = () => {
  const { recentSessions } = useGlobalState();

  return (
    <div>
      <div className="recent-sessions">
        <div className="recent-sessions__title">Recent talks</div>
        <Link to={ROUTES.AGENDA}>
          <div className="recent-sessions__all">All sessions</div>
        </Link>
      </div>
      <div className="recent-sessions__item-container">
        {recentSessions.map((session) => {
          const roomId = session.slot_roomId || "";
          const activeVisitors = Math.floor(Math.random() * 100);
          return (
            <RecentSessionsItem
              key={session.id}
              id={session.id}
              title={session.title}
              stage={STAGES_MAP.get(roomId) || "unknown"}
              activeVisitors={activeVisitors}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RecentSessions;
