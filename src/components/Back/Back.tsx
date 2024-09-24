import React from 'react';
import "./Back.scss"
import BackArrow from '../icons/BackArrow/BackArrow';
import { Link } from 'react-router-dom';

interface BackProps {
    where: string;
    link: string;
    backgroundColor?: string;
}


const Back: React.FC<BackProps> = ({
  where,
  link,
  backgroundColor
}) => {
  return (
    <div className="back-menu" style={{ backgroundColor }}>
        <Link to={link}>
          <BackArrow  backgroundColor={backgroundColor || "#FFFFFF"} />
        </Link>
        
        <Link to={link}>
          <p className="back-menu__text">
            {where}
          </p>
        </Link>
      </div>
  )
}

export default Back