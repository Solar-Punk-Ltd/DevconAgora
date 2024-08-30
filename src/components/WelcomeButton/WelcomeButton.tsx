import React from "react";
import "./WelcomeButton.scss";

interface WelcomeButtonProps {
  children: string;
}

const WelcomeButton: React.FC<WelcomeButtonProps> = ({ children }) => {
  return <button className="welcome-button">{children}</button>;
};

export default WelcomeButton;
