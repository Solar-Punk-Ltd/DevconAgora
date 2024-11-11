import React from 'react';

import PlaceIcon from '../icons/PlaceIcon/PlaceIcon';

import './Stage.scss';

interface HomeHeaderProps {
  name?: string;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ name }) => {
  return (
    <div className="stage">
      <PlaceIcon />
      {name}
    </div>
  );
};

export default HomeHeader;
