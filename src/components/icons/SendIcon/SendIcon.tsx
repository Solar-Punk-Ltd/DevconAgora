import React from "react";
import clsx from "clsx";

import "./SendIcon.scss";

interface SendIconProps {
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
}

const SendIcon: React.FC<SendIconProps> = ({
  color,
  backgroundColor,
  disabled,
}) => {
  return (
    <div className={clsx("send-icon", { "send-icon__disabled": disabled })}>
      <svg
        width="16"
        height="24"
        viewBox="0 0 16 24"
        fill={backgroundColor || "none"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.675 4.1309C15.4377 3.96978 15.1309 3.95609 14.88 4.09768L0.378751 12.347C0.130751 12.4907 -0.0157398 12.7595 0.00134771 13.0438C0.0184383 13.329 0.19616 13.5801 0.459473 13.6904L5.2501 15.7023V19.2492C5.2501 19.5236 5.4 19.7754 5.64072 19.9073C5.75313 19.9688 5.875 20.0001 5.97188 20.0001C6.113 20.0001 6.25431 19.9601 6.37781 19.881L9.85281 17.6478L12.9328 18.9416C13.0261 18.9807 13.1247 19.0002 13.2233 19.0002C13.3508 19.0002 13.4778 18.968 13.5915 18.9035C13.7931 18.7902 13.9315 18.5891 13.9649 18.3604L15.9649 4.86037C16.0344 4.57634 15.9094 4.293 15.675 4.1309ZM11.5406 7.72509L5.69375 14.2532L2.44469 12.897L11.5406 7.72509ZM6.72188 17.8751V16.3326L8.17344 16.9423L6.72188 17.8751ZM12.65 17.1845L7.13125 14.866L14.15 7.06915L12.65 17.1845Z"
          fill={color || "var(--swarm-color)"}
        />
      </svg>
    </div>
  );
};

export default SendIcon;
