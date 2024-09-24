import React from 'react';
import "./Back.scss"
import BackArrow from '../icons/BackArrow/BackArrow';
import { Link } from 'react-router-dom';

interface BackProps {
    where: string;
    link: string;
    backgroundColor?: string;
    action?: () => any | undefined | null;
}


const Back: React.FC<BackProps> = ({
  where,
  link,
  backgroundColor,
  action
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (action) {
      e.preventDefault();
      action();
    }
  }

  return (
    <div className="back-menu" style={{ backgroundColor }}>
        <Link to={link} onClick={(e) => handleClick(e)}>
          <BackArrow  backgroundColor={backgroundColor || "#FFFFFF"} />
        </Link>
        
        <Link to={link} onClick={(e) => handleClick(e)}>
          <p className="back-menu__text">
            {where}
          </p>
        </Link>
      </div>
  )
}

export default Back