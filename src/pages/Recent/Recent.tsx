import React from "react";
import TabPanel from "../../components/TabPanel/TabPanel";
import "./Recent.scss";
import DevConMainBox from "../../components/DevConMainBox/DevConMainBox";
import RecentItem from "../../components/RecentBox/RecentItem/RecentItem";

const Recent: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        height: "100vh",
      }}
    >
      <div style={{ margin: "10px" }}>
        <TabPanel />
      </div>
      <div style={{ padding: "10px", width: "100%", boxSizing: "border-box" }}>
        <DevConMainBox />
      </div>
      <div>
        <RecentItem />
        <RecentItem />
        <RecentItem />
      </div>
    </div>
  );
};

export default Recent;
