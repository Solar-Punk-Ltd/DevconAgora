import React from "react";
import "./TabPanelItem.scss";
import clsx from "clsx";

interface TabPanelItemProps {
  label: string;
  active: boolean;
  onClick?: () => void;
}

const TabPanelItem: React.FC<TabPanelItemProps> = ({
  label,
  active,
  onClick,
}) => {
  return (
    <div
      className={clsx("tab-panel-item", "flex-center", {
        "tab-panel-active": active,
      })}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default TabPanelItem;
