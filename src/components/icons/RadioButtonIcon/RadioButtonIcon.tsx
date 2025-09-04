import React from "react";

interface RightArrowIconProps {
  color?: string;
  checked?: boolean;
}

const RadioButtonIcon: React.FC<RightArrowIconProps> = ({ color, checked }) => {
  return checked ? (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.75"
        y="1.25"
        width="22.5"
        height="22.5"
        rx="11.25"
        stroke="var(--bbw-blue)"
        strokeWidth="1.5"
      />
      <circle
        cx="12"
        cy="12.5"
        r="6"
        fill={color ? color : "var(--bbw-blue)"}
      />
    </svg>
  ) : (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.75"
        y="1.25"
        width="22.5"
        height="22.5"
        rx="11.25"
        fill="transparent"
      />
      <rect
        x="0.75"
        y="1.25"
        width="22.5"
        height="22.5"
        rx="11.25"
        stroke={color ? color : "var(--bbw-blue)"}
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default RadioButtonIcon;
