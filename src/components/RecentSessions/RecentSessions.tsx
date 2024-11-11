import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useGlobalState } from "../../contexts/global";
import { ROUTES, STAGES_MAP } from "../../utils/constants";

import RecentSessionsItem from "./RecentSessionsItem/RecentSessionsItem";

import "./RecentSessions.scss";

const RecentSessions: React.FC = () => {
  const { recentSessions, talkActivity } = useGlobalState();

  return (
    <div>
      <div className="recent-sessions">
        <div className="recent-sessions__title">Recent talks</div>
        <Link to={ROUTES.AGENDA}>
          <div className="recent-sessions__all">Agenda</div>
        </Link>
      </div>
      <div className="recent-sessions__item-container">
        {recentSessions.map((session) => {
          return (
            <RecentSessionsItem
              key={session.id}
              id={session.id}
              title={session.title}
              stage={STAGES_MAP.get(session.slot_roomId || "") || ""}
              activity={talkActivity.get(session.id) || 0}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RecentSessions;
