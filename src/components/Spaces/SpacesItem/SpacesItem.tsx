import React from "react";

import ActiveVisitors from "../../ActiveVisitors/ActiveVisitors";
import RightArrowIcon from "../../icons/RightArrowIcon/RightArrowIcon";

import "./SpacesItem.scss";

interface RecentRoomsItemProps {
  title: string;
  numberOfActiveUsers: number;
}

const SpacesItem: React.FC<RecentRoomsItemProps> = ({ title, numberOfActiveUsers }) => {
  return (
    <div className="recent-rooms-item">
      <div className="recent-rooms-item__category">
        <div className="recent-rooms__item__title">{title}</div>
      </div>
      <div className="recent-rooms-item__right">
        {numberOfActiveUsers > 0 ? <ActiveVisitors number={numberOfActiveUsers} withIcon={true} /> : null}
        <RightArrowIcon color="#FFF" />
      </div>
    </div>
  );
};

export default SpacesItem;
