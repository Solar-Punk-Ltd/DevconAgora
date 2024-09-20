import React from 'react';
import "./Back.scss"

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
      <div className="back-menu__button">
        {where}
      </div>
    </div>
  )
}

export default Back