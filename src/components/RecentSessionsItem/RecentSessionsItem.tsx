import React from "react";
import "./RecentSessionsItem.scss";
import ActiveVisitors from "../ActiveVisitors/ActiveVisitors";
import Stage from "../Stage/Stage";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

interface RecentSessionsItemProps {
  id: string;
  title: string;
  stage?: string;
  activeVisitors?: number;
}

const RecentSessionsItem: React.FC<RecentSessionsItemProps> = ({
  id,
  title,
  stage,
  activeVisitors,
}) => {
  return (
    <div className="recent-sessions-item">
      <Link to={`${ROUTES.TALKS}/${id}`}>
        <div className="recent-sessions-item__title">{title}</div>
      </Link>
      <div className="recent-sessions-item__stage">
        <Stage name={stage} />
      </div>
      <ActiveVisitors number={activeVisitors} />
    </div>
  );
};

export default RecentSessionsItem;
