import React from "react";
import { Link } from "react-router-dom";

import BackArrow from "../icons/BackArrow/BackArrow";

import "./Back.scss";

interface BackProps {
  title?: string;
  where: string;
  link: string;
  backgroundColor?: string;
  action?: () => void | undefined | null;
}

const Back: React.FC<BackProps> = ({
  title,
  where,
  link,
  backgroundColor,
  action,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (action) {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="back-menu" style={{ backgroundColor }}>
      <Link to={link} onClick={(e) => handleClick(e)}>
        <BackArrow backgroundColor={backgroundColor || "#FFFFFF"} />
      </Link>

      <Link to={link} onClick={(e) => handleClick(e)}>
        <p className="back-menu__where">{where}</p>
      </Link>

      {title && <p className="back-menu__title">{title}</p>}
    </div>
  );
};

export default Back;
