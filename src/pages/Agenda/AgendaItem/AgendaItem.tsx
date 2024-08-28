import React from "react";
import "./AgendaItem.scss";
import EmptyHeartIcon from "../../../assets/empty-heart.png";

interface AgendaItemProps {
  name?: string;
  startDate?: string;
  endDate?: string;
}

const AgendaItem: React.FC<AgendaItemProps> = ({
  name,
  startDate,
  endDate,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "64px",
        alignItems: "center",
        borderBottom: "1px solid #C8C8CA",
      }}
    >
      <div
        style={{
          minWidth: "56px",
          display: "flex",
          flexDirection: "column",
          alignItems: "end",
          paddingRight: "9px",
          paddingLeft: "9px",
          borderRight: "1px solid #C8C8CA",
        }}
      >
        <div style={{ fontSize: "12px", fontWeight: "400" }}>{startDate}</div>
        <div style={{ fontSize: "12px", fontWeight: "400" }}>{endDate}</div>
      </div>
      <div style={{ fontSize: "12px", fontWeight: "700", paddingLeft: "9px" }}>
        {name}
      </div>
      <div style={{ width: "24px", paddingRight: "9px" }}>
        <img src={EmptyHeartIcon} alt="" width="24px" height="24px" />
      </div>
    </div>
  );
};

export default AgendaItem;
