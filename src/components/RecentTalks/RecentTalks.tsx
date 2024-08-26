import React from "react";
import RecentItem from "./RecentTalksItem/RecentTalksItem";
import "./RecentTalks.scss";
import { Link } from "react-router-dom";

const RecentTalks: React.FC = () => {
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
        <div style={{ fontWeight: "700", fontSize: "14px" }}>Recent talks</div>
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
      <div style={{ display: "flex", overflowY: "scroll" }}>
        <RecentItem />
        <RecentItem />
        <RecentItem />
        <RecentItem />
      </div>
    </div>
  );
};

export default RecentTalks;
