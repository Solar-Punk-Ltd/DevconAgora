import React from "react";

import "./BackArrow.scss";

interface BackArrowProps {
  color?: string;
  backgroundColor?: string;
}

const BackArrow: React.FC<BackArrowProps> = ({ color, backgroundColor }) => {
  return (
    <div
      className="back-arrow"
      style={{ backgroundColor: backgroundColor || "#F5F5F5" }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_2_406)">
          <path
            d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
            fill={color || "var(--swarm-color)"}
          />
        </g>
        <defs>
          <clipPath id="clip0_2_406">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default BackArrow;
