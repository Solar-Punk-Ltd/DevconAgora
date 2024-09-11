import React from "react";
import "./RecentSessionsItem.scss";
import ActiveVisitors from "../../ActiveVisitors/ActiveVisitors";
import PlaceIcon from "../../icons/PlaceIcon/PlaceIcon";

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
      <div className="recent-talks-item__stage">
        <PlaceIcon />
        {stage}
      </div>
      <ActiveVisitors number={activeVisitors} />
    </div>
  );
};

export default RecentSessionsItem;
