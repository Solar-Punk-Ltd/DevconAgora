import React from "react";
import "./TabPanel.scss";
import clsx from "clsx";

interface TabPanelProps {
  version?: "underlined" | "filled" | "outlined";
  children: React.ReactNode;
}

interface TabPanelItemProps {
  label: string;
  active: boolean;
  version?: "underlined" | "filled" | "outlined";
  onClick?: () => void;
}

const TabPanel: React.FC<TabPanelProps> = ({ version, children }) => {
  const [activeTab, setActiveTab] = React.useState(0);
  // const TabItems = ["Recent", "All rooms", "Blogs"];
  return (
    <div
      className={clsx("tab-panel", {
        "tab-panel__outlined": version === "outlined",
      })}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement<TabPanelItemProps>(child)) {
          return React.cloneElement(child, {
            active: index === activeTab,
            version: version,
            onClick: () => setActiveTab(index),
          });
        }
        return child;
      })}
    </div>
  );
};

export default TabPanel;
