import React from "react";
import "./TabPanelItem.scss";
import clsx from "clsx";

interface TabPanelItemProps {
  label: string;
  active?: boolean;
  version?: "underlined" | "filled" | "outlined";
  onClick?: () => void;
}

const TabPanelItem: React.FC<TabPanelItemProps> = ({
  label,
  active,
  version,
  onClick,
}) => {
  return (
    <div
      className={clsx("tab-panel-item", "flex-center", {
        // "tab-panel-item__active": active,
        "tab-panel-item__underlined": version === "underlined",
        "tab-panel-item__underlined__active":
          active && version === "underlined",
        "tab-panel-item__filled": version === "filled",
        "tab-panel-item__filled__active": active && version === "filled",
        "tab-panel-item__outlined": version === "outlined",
        "tab-panel-item__outlined__active": active && version === "outlined",
      })}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default TabPanelItem;
