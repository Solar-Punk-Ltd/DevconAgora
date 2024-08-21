import React from "react";
import "./UpcomingTalkBox.scss";
import UpcomingTalkBoxItem from "./UpcomingTalkBoxItem/UpcomingTalkBoxItem";

const UpcomingTalkBox: React.FC = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div>Upcoming talks</div>
        <div style={{ textDecoration: "underline" }}>All</div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          overflowX: "scroll",
          whiteSpace: "nowrap",
        }}
      >
        <UpcomingTalkBoxItem />
        <UpcomingTalkBoxItem />
        <UpcomingTalkBoxItem />
        <UpcomingTalkBoxItem />
        <UpcomingTalkBoxItem />
        <UpcomingTalkBoxItem />
        <UpcomingTalkBoxItem />
        <UpcomingTalkBoxItem />
        <UpcomingTalkBoxItem />
        <UpcomingTalkBoxItem />
        <UpcomingTalkBoxItem />
        <UpcomingTalkBoxItem />
        <UpcomingTalkBoxItem />
      </div>
    </div>
  );
};

export default UpcomingTalkBox;
