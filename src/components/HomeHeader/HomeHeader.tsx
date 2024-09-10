import React from "react";
import "./HomeHeader.scss";
import swarmIcon from "../../assets/swarm-icon.png";
import OpenProfilePicture from "../OpenProfilePicture/OpenProfilePicture";
import { Link } from "react-router-dom";

interface HomeHeaderProps {
  points?: number;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ points }) => {
  return (
    <div className="home-header">
      <div className="home-header__name">DEVCON.BUZZ</div>
      <div className="home-header--right">
        <div className="home-header__points">
          {points ? points : 0}
          <img src={swarmIcon} alt="" width="15px" height="15px" />
        </div>
        <Link to="/profile">
          <div className="home-header__profile">
            <OpenProfilePicture name="CM" version="small" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomeHeader;
