import React from "react";
import rightArrowIcon from "../../../assets/right-arrow-big.png";
import "./RecentRoomsItem.scss";

interface RecentRoomsItemProps {
  title: string;
  numberOfActiveUsers: number;
}

const RecentRoomsItem: React.FC<RecentRoomsItemProps> = ({
  title,
  numberOfActiveUsers,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "48px",
        width: "100%",
        borderRadius: "8px",
        backgroundColor: "white",
        marginBottom: "4px",
        boxShadow: "0px 2px 4px 0px #1F1F231A",
        marginRight: "15px",
        padding: "8px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: "18px", fontWeight: "400" }}>{title}</div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            alignItems: "end",
            flexDirection: "column",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: "700" }}>
            {numberOfActiveUsers}
          </div>
          <div style={{ fontSize: "12px", fontWeight: "400" }}>active</div>
          <div
            style={{ width: "19px", height: "4px", backgroundColor: "#949499" }}
          ></div>
        </div>
        <div>
          <img src={rightArrowIcon} alt="" width="24px" height="24px" />
        </div>
      </div>
    </div>
  );
};

export default RecentRoomsItem;
