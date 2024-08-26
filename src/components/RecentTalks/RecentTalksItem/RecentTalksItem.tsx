import React from "react";
import "./RecentTalksItem.scss";

const RecentItem: React.FC = () => {
  return (
    <div
      style={{
        height: "101px",
        minWidth: "152px",
        borderRadius: "8px",
        backgroundColor: "white",
        marginBottom: "4px",
        boxShadow: "0px 2px 4px 0px #1F1F231A",
        marginRight: "15px",
        padding: "8px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: "18px", fontWeight: "400", marginBottom: "4px" }}>
        Talk title
      </div>
      <div style={{ fontSize: "12px", fontWeight: "400", marginBottom: "4px" }}>
        Stage 1
      </div>
      <div style={{ fontWeight: "700", fontSize: "12px" }}>
        110 active visitors
      </div>
    </div>
  );
};

export default RecentItem;
