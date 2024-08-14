import React from "react";
import "./TabPanel.scss";
import clsx from "clsx";

const TabPanel: React.FC = () => {
  return (
    <div style={{ backgroundColor: "#F5F5F5", height: "100vh" }}>
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
          }}
          className={clsx("tab-panel-item", "flex-center", {})}
        >
          Recent
        </div>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
          }}
          className={clsx("tab-panel-item", "flex-center", {})}
        >
          All rooms
        </div>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
          }}
          className={clsx("tab-panel-item", "flex-center", {})}
        >
          Blogs
        </div>
      </div>
    </div>
  );
};

export default TabPanel;
