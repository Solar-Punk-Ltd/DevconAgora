import React from "react";
import "./DevconLounge.scss";
import RecentSessionsItem from "../../components/RecentSessions/RecentSessionsItem/RecentSessionsItem";
import Header from "../../components/Header/Header";

const DevconLounge: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        height: "calc(var(--vh, 1vh) * 100)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
        }}
      >
        <Header name="Agora" />
      </div>
      <div
        style={{ padding: "10px", width: "360px", boxSizing: "border-box" }}
      ></div>
      <div>
        <RecentSessionsItem id={"dummy1"} title={"dummytitle1"} />
        <RecentSessionsItem id={"dummy3"} title={"dummytitle2"} />
        <RecentSessionsItem id={"dummy2"} title={"dummytitle3"} />
      </div>
    </div>
  );
};

export default DevconLounge;
