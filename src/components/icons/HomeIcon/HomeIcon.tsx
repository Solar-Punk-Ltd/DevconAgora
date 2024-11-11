import React from 'react';

interface HomeIconProps {
  color?: string;
}

const HomeIcon: React.FC<HomeIconProps> = ({ color }) => {
  return (
    <div>
      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_5296_3039)">
          <path d="M10.5 20V14H14.5V20H19.5V12H22.5L12.5 3L2.5 12H5.5V20H10.5Z" fill={color ? color : 'black'} />
        </g>
        <defs>
          <clipPath id="clip0_5296_3039">
            <rect width="24" height="24" fill="white" transform="translate(0.5)" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default HomeIcon;
