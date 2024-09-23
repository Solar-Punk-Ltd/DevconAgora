import React from 'react';
import "./Back.scss"
import BackArrow from '../icons/BackArrow/BackArrow';

interface BackProps {
    where: string;
    link: string;
}


const Back: React.FC<BackProps> = ({
  where,
  link
}) => {
  return (
    <div className="back-menu">
      <BackArrow  backgroundColor={"#FFFFFF"} />
      
      <p className="back-menu__text">
        {where}
      </p>
    </div>
  )
}

export default Back