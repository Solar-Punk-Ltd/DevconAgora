import React from "react";
import "./RecentRooms.scss";
import { Link } from "react-router-dom";
import RecentRoomsItem from "./RecentRoomsItem/RecentRoomsItem";

const RecentRooms: React.FC = () => {
  return (
    <div>
      <div className="recent-rooms">
        <div style={{}} className="recent-rooms__title">
          Recent rooms
        </div>
        <Link to="/recent">
          <div className="recent-rooms__all">All rooms</div>
        </Link>
      </div>
      <div>
        <RecentRoomsItem title="Layer 2s" numberOfActiveUsers={29} />
        <RecentRoomsItem title="Core protocol" numberOfActiveUsers={29} />
        <RecentRoomsItem
          title="Cypherhunk and privacy"
          numberOfActiveUsers={29}
        />
      </div>
    </div>
  );
};

export default RecentRooms;
