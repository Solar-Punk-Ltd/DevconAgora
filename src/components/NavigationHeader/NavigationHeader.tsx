import React from "react";
import "./NavigationHeader.scss";
import { useNavigate } from "react-router-dom";
import LeftNavigationIcon from "../icons/LeftNavigationIcon/LeftNavigationIcon";

interface NavigationHeaderProps {
  to: string;
  saveQuestionBeforeLeave?: boolean;
  handlerInCaseOfSave?: () => void;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  to,
  saveQuestionBeforeLeave,
  handlerInCaseOfSave,
}) => {
  const navigate = useNavigate();
  const formattedTo = to.charAt(1).toUpperCase() + to.slice(2);

  const handleNavigation = () => {
    if (saveQuestionBeforeLeave) {
      if (handlerInCaseOfSave) {
        handlerInCaseOfSave();
      }
    } else {
      navigate(to);
    }
  };
  return (
    <div className="navigation-header" onClick={handleNavigation}>
      <div className="navigation-header__link">
        <LeftNavigationIcon />
      </div>
      <div className="navigation-header__text">{formattedTo}</div>
    </div>
  );
};

export default NavigationHeader;
