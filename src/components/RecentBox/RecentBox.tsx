import React from "react";
import RecentItem from "./RecentItem/RecentItem";
import "./RecentBox.scss";
import { Link } from "react-router-dom";

const RecentBox: React.FC = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div>Recent</div>
        <Link to="/recent">
          <div style={{ textDecoration: "underline" }}>All</div>
        </Link>
      </div>
      <RecentItem />
      <RecentItem />
      <RecentItem />
    </div>
  );
};

export default RecentBox;
