import React from "react";
import "./NavigationHeader.scss";
import { useNavigate } from "react-router-dom";
import LeftNavigationIcon from "../icons/LeftNavigationIcon/LeftNavigationIcon";

interface NavigationHeaderProps {
  to?: string;
  toText?: string;
  saveQuestionBeforeLeave?: boolean;
  handlerInCaseOfSave?: () => void;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  to,
  toText,
  saveQuestionBeforeLeave,
  handlerInCaseOfSave,
}) => {
  const navigate = useNavigate();
  const formattedTo = to
    ? to.charAt(1).toUpperCase() + to.slice(2)
    : toText
    ? toText.charAt(1).toUpperCase() + toText.slice(2)
    : "";

  const handleNavigation = () => {
    if (saveQuestionBeforeLeave) {
      if (handlerInCaseOfSave) {
        handlerInCaseOfSave();
      }
    } else {
      if (to) {
        navigate(to);
      } else {
        navigate(-1);
      }
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
