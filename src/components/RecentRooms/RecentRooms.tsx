import React from "react";
import "./RecentRooms.scss";
import { Link } from "react-router-dom";
import RecentRoomsItem from "./RecentRoomsItem/RecentRoomsItem";

const RecentRooms: React.FC = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          marginTop: "20px",
        }}
      >
        <div style={{ fontWeight: "700", fontSize: "14px" }}>Recent rooms</div>
        <Link to="/recent">
          <div
            style={{
              textDecoration: "underline",
              fontSize: "14px",
              fontWeight: "400",
            }}
          >
            All talks
          </div>
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
