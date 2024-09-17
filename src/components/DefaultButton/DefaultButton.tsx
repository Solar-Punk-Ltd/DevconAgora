import React from "react";
import "./DefaultButton.scss";
import clsx from "clsx";

interface DefaultButtonProps {
  children: string;
  version?: "filled" | "outlined";
  onClick?: () => void;
}

const DefaultButton: React.FC<DefaultButtonProps> = ({
  children,
  version,
  onClick,
}) => {
  return (
    <button
      className={clsx(
        "default-button",
        version && `default-button__${version}`
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default DefaultButton;
