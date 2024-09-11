import React from "react";
import "./WelcomeButton.scss";
import clsx from "clsx";

interface WelcomeButtonProps {
  children: string;
  version?: "filled" | "outlined" | "inactive";
}

const WelcomeButton: React.FC<WelcomeButtonProps> = ({ children, version }) => {
  return (
    <button
      disabled={version === "inactive"}
      className={clsx("welcome-button", {
        "welcome-button--filled": version === "filled",
        "welcome-button--outlined": version === "outlined",
        "welcome-button--inactive": version === "inactive",
      })}
    >
      {children}
    </button>
  );
};

export default WelcomeButton;
