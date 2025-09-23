import React from "react";

interface PlusIconProps {
  color?: string;
}

const PlusIcon: React.FC<PlusIconProps> = ({ color }) => {
  return (
    <div style={{ display: "flex" }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13.3337 9.33317H9.33366V13.3332H6.66699V9.33317H2.66699V6.6665H6.66699V2.6665H9.33366V6.6665H13.3337V9.33317Z"
          fill={color ? color : "white"}
        />
      </svg>
    </div>
  );
};

export default PlusIcon;
