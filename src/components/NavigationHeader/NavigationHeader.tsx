import React from "react";
import "./NavigationHeader.scss";
import { Link } from "react-router-dom";
import LeftNavigationIcon from "../icons/LeftNavigationIcon/LeftNavigationIcon";

interface NavigationHeaderProps {
  to: string;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ to }) => {
  const formattedTo = to.charAt(1).toUpperCase() + to.slice(2);
  return (
    <div className="navigation-header">
      <Link to={to} className="navigation-header__link">
        <LeftNavigationIcon />
      </Link>
      <div className="navigation-header__text">{formattedTo}</div>
    </div>
  );
};

export default NavigationHeader;
