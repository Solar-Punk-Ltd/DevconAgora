import React from "react";
import RecentItem from "./RecentItem/RecentItem";
import "./RecentBox.scss";

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
        <div style={{ textDecoration: "underline" }}>All</div>
      </div>
      <RecentItem />
      <RecentItem />
      <RecentItem />
    </div>
  );
};

export default RecentBox;
