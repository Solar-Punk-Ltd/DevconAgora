import React from "react";
import "./WelcomeButton.scss";
import clsx from "clsx";

interface WelcomeButtonProps {
  children: string;
  version?: "filled" | "outlined" | "inactive";
  onClick?: () => void;
}

const WelcomeButton: React.FC<WelcomeButtonProps> = ({
  children,
  version,
  onClick,
}) => {
  return (
    <button
      disabled={version === "inactive"}
      className={clsx("welcome-button", {
        "welcome-button--filled": version === "filled",
        "welcome-button--outlined": version === "outlined",
        "welcome-button--inactive": version === "inactive",
      })}
      onClick={() => (onClick ? onClick() : null)}
    >
      {children}
    </button>
  );
};

export default WelcomeButton;
