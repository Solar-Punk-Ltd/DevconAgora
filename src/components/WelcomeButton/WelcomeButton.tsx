import clsx from "clsx";
import React from "react";

import "./WelcomeButton.scss";

interface WelcomeButtonProps {
  children: string;
  version?: "filled" | "outlined" | "inactive";
  type?: "white" | "orange" | "normal";
  onClick?: () => void;
}

const WelcomeButton: React.FC<WelcomeButtonProps> = ({ children, version, type, onClick }) => {
  return (
    <button
      disabled={version === "inactive"}
      className={clsx("welcome-button", {
        "welcome-button--filled": version === "filled",
        "welcome-button--outlined": version === "outlined",
        "welcome-button--inactive": version === "inactive",
        "welcome-button--white": type === "white",
        "welcome-button--orange": type === "orange",
      })}
      onClick={() => (onClick ? onClick() : null)}
    >
      {children}
    </button>
  );
};

export default WelcomeButton;
