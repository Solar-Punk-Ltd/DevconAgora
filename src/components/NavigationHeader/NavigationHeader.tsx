import React from "react";
import { useNavigate } from "react-router-dom";

import LeftNavigationIcon from "../icons/LeftNavigationIcon/LeftNavigationIcon";

import "./NavigationHeader.scss";

interface NavigationHeaderProps {
  backgroundColor?: string;
  to?: string;
  toText?: string;
  saveQuestionBeforeLeave?: boolean;
  handlerInCaseOfSave?: () => void;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ backgroundColor, to, toText, saveQuestionBeforeLeave, handlerInCaseOfSave }) => {
  const navigate = useNavigate();

  const decodedTo = to ? decodeURIComponent(to) : undefined;
  const decodedToText = toText ? decodeURIComponent(toText) : undefined;

  const formattedTo = decodedTo
    ? decodedTo.charAt(1).toUpperCase() + decodedTo.slice(2)
    : decodedToText
    ? decodedToText.charAt(1).toUpperCase() + decodedToText.slice(2)
    : "";

  const handleNavigation = () => {
    if (saveQuestionBeforeLeave) {
      if (handlerInCaseOfSave) {
        handlerInCaseOfSave();
      }
    } else {
      if (to && to.length > 0) {
        navigate(to);
      } else {
        navigate(-1);
      }
    }
  };
  return (
    <div className="navigation-header__wrapper" style={{ backgroundColor: backgroundColor }}>
      <div className="navigation-header" onClick={handleNavigation}>
        <div className="navigation-header__link">
          <LeftNavigationIcon color="#FFF" />
        </div>
        <div className="navigation-header__text">{formattedTo}</div>
      </div>
    </div>
  );
};

export default NavigationHeader;
