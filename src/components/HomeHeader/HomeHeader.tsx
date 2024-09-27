import React from "react";
import "./HomeHeader.scss";
import swarmIcon from "../../assets/swarm-icon.png";
import ProfilePicture from "../ProfilePicture/ProfilePicture";
import { Link } from "react-router-dom";
import { useGlobalState } from "../../GlobalStateContext";
import { ROUTES } from "../../utils/constants";

interface HomeHeaderProps {
  points?: number;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ points }) => {
  const { monogram, showGamification, setShowGamification, setPoints } =
    useGlobalState();
  return (
    <div className="home-header">
      <div className="home-header__name">DEVCON.BUZZ</div>
      <div className="home-header--right">
        <button onClick={() => setPoints(1)}>points 1</button>
        <button onClick={() => setPoints(5)}>points 5</button>
        <button onClick={() => setPoints(10)}>points 10</button>
        <div
          className="home-header__points"
          onClick={() => setShowGamification(!showGamification)}
        >
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
