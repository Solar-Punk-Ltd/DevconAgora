import React from "react";

interface CloseIconProps {
  checked: boolean;
  color?: string;
  onClick?: () => void;
}

const CloseIcon: React.FC<CloseIconProps> = ({ checked, color, onClick }) => {
  return (
    <div onClick={onClick} style={{ display: "flex" }}>
      {checked ? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.75"
            y="0.75"
            width="22.5"
            height="22.5"
            rx="1.25"
            fill="white"
          />
          <rect
            x="0.75"
            y="0.75"
            width="22.5"
            height="22.5"
            rx="1.25"
            stroke={color ? color : "var(--default-purple)"}
            strokeWidth="1.5"
          />
          <path
            d="M9.00004 20.4209L2.79004 14.2109L5.62004 11.3809L9.00004 14.7709L18.88 4.88086L21.71 7.71086L9.00004 20.4209Z"
            fill={color ? color : "var(--default-purple)"}
          />
        </svg>
      ) : (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.75"
            y="0.75"
            width="22.5"
            height="22.5"
            rx="1.25"
            fill="white"
          />
          <rect
            x="0.75"
            y="0.75"
            width="22.5"
            height="22.5"
            rx="1.25"
            stroke={color ? color : "var(--default-purple)"}
            strokeWidth="1.5"
          />
        </svg>
      )}
    </div>
  );
};

export default CloseIcon;
