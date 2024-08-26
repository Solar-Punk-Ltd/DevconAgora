import React from "react";
import "./UpcomingTalkBoxItem.scss";

interface UpcomingTalkBoxItemProps {
  key: string;
  title: string;
}

const UpcomingTalkBoxItem: React.FC<UpcomingTalkBoxItemProps> = ({ title }) => {
  return (
    <div
      style={{
        minWidth: "118px",
        height: "92px",
        borderRadius: "8px",
        backgroundColor: "white",
        marginRight: "8px",
      }}
    >
      <p>{title}</p>
    </div>
  );
};

export default UpcomingTalkBoxItem;
