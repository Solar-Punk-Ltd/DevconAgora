import React from "react";
import { Link } from "react-router-dom";

import { useGlobalState } from "../../contexts/global";
import { ROUTES } from "../../utils/constants";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

import "./HomeHeader.scss";

interface HomeHeaderProps {}

const HomeHeader: React.FC<HomeHeaderProps> = ({}) => {
  const { monogram } = useGlobalState();
  return (
    <div className="home-header">
      <div className="home-header__name">BBW2025.BUZZ</div>
      <div className="home-header--right">
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
