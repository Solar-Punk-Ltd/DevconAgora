import React from 'react';
import { Link } from 'react-router-dom';

import swarmIcon from '../../assets/swarm-icon.png';
import { useGlobalState } from '../../GlobalStateContext';
import { ROUTES } from '../../utils/constants';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

import './HomeHeader.scss';

interface HomeHeaderProps {
  points?: number;
  withGamification?: boolean;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ points, withGamification }) => {
  const { monogram, setPoints } = useGlobalState();
  return (
    <div className="home-header">
      <div className="home-header__name">DEVCON.BUZZ</div>
      <div className="home-header--right">
        <div style={withGamification ? { display: 'flex' } : { display: 'none' }}>
          <div style={{ fontSize: '10px', display: 'flex', alignItems: 'center' }}>
            Version: {process.env.PR_NUMBER} - {process.env.PR_TIMESTAMP}
          </div>
          <button onClick={() => setPoints(1)}>1</button>
          <button onClick={() => setPoints(5)}>5</button>
          <button onClick={() => setPoints(10)}>10</button>
        </div>
        <div className="home-header__points">
          {points ? points : 0}
          <img src={swarmIcon} alt="" width="15px" height="15px" />
        </div>
        <Link to={ROUTES.PROFILE}>
          <div className="home-header__profile">
            <ProfilePicture name={monogram} version="small" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomeHeader;
