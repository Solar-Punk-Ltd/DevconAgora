import React from "react";

import "./LikeIconFilled.scss";

interface LikeProps {
  color?: string;
}

const LikeIconFilled: React.FC<LikeProps> = ({ color }) => {
  return (
    <div className="like-icon">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill={color || "indigo"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_2272_3865)">
          <path d="M6.00033 13.9993H12.0003C12.5537 13.9993 13.027 13.666 13.227 13.186L15.2403 8.48602C15.3003 8.33268 15.3337 8.17268 15.3337 7.99935V6.66602C15.3337 5.93268 14.7337 5.33268 14.0003 5.33268H9.79366L10.427 2.28602L10.447 2.07268C10.447 1.79935 10.3337 1.54602 10.1537 1.36602L9.44699 0.666016L5.05366 5.05935C4.81366 5.29935 4.66699 5.63268 4.66699 5.99935V12.666C4.66699 13.3993 5.26699 13.9993 6.00033 13.9993ZM0.666992 5.99935H3.33366V13.9993H0.666992V5.99935Z" />
        </g>
        <defs>
          <clipPath id="clip0_2272_3865">
            <rect width="16" height="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default LikeIconFilled;
