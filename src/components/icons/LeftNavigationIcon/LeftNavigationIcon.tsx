import React from "react";

interface HomeIconProps {
  color?: string;
}

const HomeIcon: React.FC<HomeIconProps> = ({ color }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_5082_9220)">
        <path
          d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
          fill={color ? color : "#FF8A50"}
        />
      </g>
      <defs>
        <clipPath id="clip0_5082_9220">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default HomeIcon;
