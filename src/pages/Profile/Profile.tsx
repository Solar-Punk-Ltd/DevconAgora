import React from "react";
import { Link } from "react-router-dom";

import HomeBackground from "../../assets/welcome-glass-effect.png";
import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";
import ProfileBox from "../../components/ProfileBox/ProfileBox";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";
import Settings from "../../components/Settings/Settings";
import { useGlobalState } from "../../GlobalStateContext";
import { ROUTES } from "../../utils/constants";

import "./Profile.scss";

const Profile: React.FC = () => {
  const { username, monogram, points } = useGlobalState();
  return (
    <div className="profile">
      <Settings />
      <NavigationHeader to={ROUTES.HOME} />
      <div className="profile__content">
        <div>
          <ProfilePicture name={monogram} version="big" />
        </div>
        <div className="profile__content__datas">
          <div className="profile__content__background">
            <img src={HomeBackground} alt="" className="profile__content__background__image" />
          </div>
          <div className="profile__content__datas__user">
            <div className="profile-creation__username">Nickname</div>
            <div className="profile__username">{username}</div>
          </div>
          <ProfileBox
            title="Points"
            linkText="Claim your reward"
            link={ROUTES.CLAIMREWARD}
            points={points}
            shareable={false}
            showPoints={true}
            showContent={true}
          />
          <ProfileBox title="Share the experience with others" linkText="Share referal link" showPoints={false} showContent={true} shareable={true} />
          <Link to={ROUTES.HOWDOESITWORK} className="profile__content__datas__how-does-it-work">
            <ProfileBox title="How does it work?" showPoints={false} showContent={false} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
