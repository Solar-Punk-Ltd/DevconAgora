import React from "react";
import "./SpacesItem.scss";
import ActiveVisitors from "../../ActiveVisitors/ActiveVisitors";
import RightArrowIcon from "../../icons/RightArrowIcon/RightArrowIcon";
import { CATEGORY_IMAGES_MAP } from "../../../utils/constants";

interface RecentRoomsItemProps {
  title: string;
  numberOfActiveUsers: number;
}

const SpacesItem: React.FC<RecentRoomsItemProps> = ({
  title,
  numberOfActiveUsers,
}) => {
  const imageUrl = CATEGORY_IMAGES_MAP.get(title);
  return (
    <div className="recent-rooms-item">
      <div className="recent-rooms-item__category">
        {imageUrl ? (
          <img src={imageUrl} alt="" width="24px" height="24px" />
        ) : null}
        <div className="recent-rooms__item__title">{title}</div>
      </div>
      <div className="recent-rooms-item__right">
        {numberOfActiveUsers > 0 ? (
          <ActiveVisitors number={numberOfActiveUsers} withIcon={true} />
        ) : null}
        <RightArrowIcon />
      </div>
    </div>
  );
};

export default SpacesItem;
