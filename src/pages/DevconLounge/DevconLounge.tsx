import React from "react";
import TabPanel from "../../components/TabPanel/TabPanel";
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
        height: "100vh",
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
      <div style={{ margin: "10px" }}>
        <TabPanel />
      </div>
      <div
        style={{ padding: "10px", width: "360px", boxSizing: "border-box" }}
      ></div>
      <div>
        <RecentSessionsItem />
        <RecentSessionsItem />
        <RecentSessionsItem />
      </div>
    </div>
  );
};

export default DevconLounge;
