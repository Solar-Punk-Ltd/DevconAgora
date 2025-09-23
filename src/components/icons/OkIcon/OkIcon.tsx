import React from "react";

interface OkIconProps {
  color?: string;
  onClick?: () => void;
}

const OkIcon: React.FC<OkIconProps> = ({ color, onClick }) => {
  return (
    <div onClick={onClick}>
      <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5.92336 14L1 9.20463L3.24366 7.0193L5.92336 9.63707L13.7563 2L16 4.18533L5.92336 14Z"
          fill={color ? color : "var(--ok-edit-icon-color)"}
        />
      </svg>
    </div>
  );
};

export default OkIcon;
