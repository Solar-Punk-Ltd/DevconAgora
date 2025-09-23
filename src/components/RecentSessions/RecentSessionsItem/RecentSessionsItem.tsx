import React from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../../constants/routes";
import ActiveVisitors from "../../ActiveVisitors/ActiveVisitors";
import Stage from "../../Stage/Stage";

import "./RecentSessionsItem.scss";

interface RecentSessionsItemProps {
  id: string;
  title: string;
  stage?: string;
  activity?: number;
}

const RecentSessionsItem: React.FC<RecentSessionsItemProps> = ({ id, title, stage, activity }) => {
  return (
    <Link to={`${ROUTES.TALKS}/${id}`} className="recent-sessions-item">
      <div className="recent-sessions-item__title">{title}</div>
      <div className="recent-sessions-item__stage">
        <Stage name={stage} />
      </div>
      {activity !== undefined && activity > 0 && <ActiveVisitors number={activity} withIcon={true} />}
    </Link>
  );
};

export default RecentSessionsItem;
