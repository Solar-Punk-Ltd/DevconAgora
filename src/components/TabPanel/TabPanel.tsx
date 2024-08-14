import React from "react";
import "./TabPanel.scss";
import TabPanelItem from "./TabPanelItem/TabPanelItem";

const TabPanel: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const TabItems = ["Recent", "All rooms", "Blogs"];
  return (
    <div>
      <div
        style={{
          display: "flex",
        }}
      >
        {TabItems.map((item, index) => (
          <TabPanelItem
            label={item}
            active={index === activeTab}
            key={index}
            onClick={() => setActiveTab(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default TabPanel;
