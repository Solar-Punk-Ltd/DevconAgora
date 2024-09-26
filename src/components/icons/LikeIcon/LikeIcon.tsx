import React from "react";
import "./LikeIcon.scss";

interface LikeProps {
  fillColor?: string;
  contourColor?: string;
}

const LikeIcon: React.FC<LikeProps> = ({
  fillColor,
  contourColor,
}) => {
  return (
    <div
      className="like-icon"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill={fillColor || "none"} xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_2_710)">
          <path d="M6.00002 14H12C12.5534 14 13.0267 13.6667 13.2267 13.1867L15.24 8.48666C15.3 8.33333 15.3334 8.17333 15.3334 8V6.66666C15.3334 5.93333 14.7334 5.33333 14 5.33333H9.79335L10.4267 2.28666L10.4467 2.07333C10.4467 1.8 10.3334 1.54666 10.1534 1.36666L9.44669 0.666664L5.05335 5.06C4.81335 5.3 4.66669 5.63333 4.66669 6V12.6667C4.66669 13.4 5.26669 14 6.00002 14ZM6.00002 6L8.89335 3.10666L8.00002 6.66666H14V8L12 12.6667H6.00002V6ZM0.666687 6H3.33335V14H0.666687V6Z" fill="#323232"/>
        </g>
        <defs>
         <clipPath id="clip0_2_710">
            <rect width="16" height="16" fill={contourColor || "white"}/>
         </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default LikeIcon;
