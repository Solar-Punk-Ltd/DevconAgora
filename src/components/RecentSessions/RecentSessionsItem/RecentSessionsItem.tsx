import React from "react";
import "./RecentSessionsItem.scss";
import ActiveVisitors from "../../ActiveVisitors/ActiveVisitors";
import Stage from "../../Stage/Stage";

interface RecentSessionsItemProps {
  title?: string;
  stage?: string;
  activeVisitors?: number;
}

const RecentSessionsItem: React.FC<RecentSessionsItemProps> = ({
  title,
  stage,
  activeVisitors,
}) => {
  return (
    <div className="recent-talks-item">
      <div className="recent-talks-item__title">{title}</div>
      <div className="recent-sessions-item__stage">
        <Stage name={stage} />
      </div>
      <ActiveVisitors number={activeVisitors} />
    </div>
  );
};

export default RecentSessionsItem;
