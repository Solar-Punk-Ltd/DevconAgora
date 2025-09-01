import React from "react";

import "./WelcomeProgressIndicator.scss";

interface WelcomeProgressIndicatorProps {
  active: number;
}

const WelcomeProgressIndicator: React.FC<WelcomeProgressIndicatorProps> = ({ active }) => {
  return (
    <div className="welcome-progress-indicator">
      <div className={active >= 0 ? "welcome-progress-indicator__active" : "welcome-progress-indicator__inactive"}></div>
      <div className={active >= 1 ? "welcome-progress-indicator__active" : "welcome-progress-indicator__inactive"}></div>
      <div className={active >= 2 ? "welcome-progress-indicator__active" : "welcome-progress-indicator__inactive"}></div>
      <div className={active >= 3 ? "welcome-progress-indicator__active" : "welcome-progress-indicator__inactive"}></div>
    </div>
  );
};

export default WelcomeProgressIndicator;
