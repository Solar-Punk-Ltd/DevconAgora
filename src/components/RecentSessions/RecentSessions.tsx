import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./RecentSessions.scss";
import RecentSessionsItem from "./RecentSessionsItem/RecentSessionsItem";
import { useGlobalState } from "../../GlobalStateContext";
import { ROUTES, STAGES_MAP } from "../../utils/constants";

const RecentSessions: React.FC = () => {
  const { recentSessions, talkActivity } = useGlobalState();
  const [activity, setActivity] = useState<Map<string, number>>(
    new Map<string, number>()
  );

  useEffect(() => {
    const tmpActivity = new Map<string, number>();
    for (let i = 0; i < recentSessions.length; i++) {
      tmpActivity.set(
        recentSessions[i].id,
        talkActivity.get(recentSessions[i].id) || 0
      );
    }
    setActivity(tmpActivity);
  }, [talkActivity]);

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
          return (
            <RecentSessionsItem
              key={session.id}
              id={session.id}
              title={session.title}
              stage={STAGES_MAP.get(roomId) || ""}
              activity={activity.get(session.id) || 0}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RecentSessions;
