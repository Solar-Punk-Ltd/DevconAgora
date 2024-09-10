import React from "react";
import "./RecentRoomsItem.scss";
import ActiveVisitors from "../../ActiveVisitors/ActiveVisitors";
import RightArrowIcon from "../../icons/RightArrowIcon/RightArrowIcon";

interface RecentRoomsItemProps {
  title: string;
  numberOfActiveUsers: number;
}

const RecentRoomsItem: React.FC<RecentRoomsItemProps> = ({
  title,
  numberOfActiveUsers,
}) => {
  return (
    <div style={{}} className="recent-rooms-item">
      <div className="recent-rooms__item__title">{title}</div>
      <div className="recent-rooms-item__right">
        <ActiveVisitors number={numberOfActiveUsers} withIcon={true} />
        <RightArrowIcon />
        {/* <div>
          <img src={rightArrowIcon} alt="" width="24px" height="24px" />
        </div> */}
      </div>
    </div>
  );
};

export default RecentRoomsItem;
