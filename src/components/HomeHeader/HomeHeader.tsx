import React from "react";
import { Link } from "react-router-dom";

import swarmIcon from "../../assets/swarm-icon.png";
import { ROUTES } from "../../constants/routes";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

import "./HomeHeader.scss";
import { useUserContext } from "@/contexts/user";
import { createMonogram } from "@/utils/user";


const HomeHeader: React.FC = () => {
  const { username } = useUserContext();

  return (
    <div className="home-header">
      <div className="home-header__name">BBW2025.BUZZ</div>
      <div className="home-header--right">
        <div className="home-header__points">
          <img src={swarmIcon} alt="" width="15px" height="15px" />
        </div>
        <Link to={ROUTES.PROFILE}>
          <div className="home-header__profile">
            <ProfilePicture name={createMonogram(username)} version="small" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomeHeader;
