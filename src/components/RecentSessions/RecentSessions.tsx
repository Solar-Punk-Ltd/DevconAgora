import React from "react";
import "./RecentSessions.scss";
import { Link } from "react-router-dom";
import RecentSessionsItem from "./RecentSessionsItem/RecentSessionsItem";

const RecentSessions: React.FC = () => {
  return (
    <div>
      <div className="recent-talks">
        <div style={{}} className="recent-talks__title">
          Recent sessions
        </div>
        <Link to="/recent">
          <div className="recent-talks__all">All sessions</div>
        </Link>
      </div>
      <div className="recent-talks__item-container">
        <RecentSessionsItem
          title="Ethereum for the next billion"
          stage="Stage 1"
          activeVisitors={110}
        />
        <RecentSessionsItem
          title="Ethereum for the next billion"
          stage="Stage 1"
          activeVisitors={110}
        />
        <RecentSessionsItem
          title="Ethereum for the next billion"
          stage="Stage 1"
          activeVisitors={110}
        />
        <RecentSessionsItem
          title="Ethereum for the next billion"
          stage="Stage 1"
          activeVisitors={110}
        />
        <RecentSessionsItem
          title="Ethereum for the next billion"
          stage="Stage 1"
          activeVisitors={110}
        />
        <RecentSessionsItem
          title="Ethereum for the next billion"
          stage="Stage 1"
          activeVisitors={110}
        />
        <RecentSessionsItem
          title="Ethereum for the next billion"
          stage="Stage 1"
          activeVisitors={110}
        />
        <RecentSessionsItem
          title="Ethereum for the next billion"
          stage="Stage 1"
          activeVisitors={110}
        />
        <RecentSessionsItem
          title="Ethereum for the next billion"
          stage="Stage 1"
          activeVisitors={110}
        />
        <RecentSessionsItem
          title="Ethereum for the next billion"
          stage="Stage 1"
          activeVisitors={110}
        />
      </div>
    </div>
  );
};

export default RecentSessions;
