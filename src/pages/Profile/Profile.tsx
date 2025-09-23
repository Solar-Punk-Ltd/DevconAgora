import React from "react";
import { Link } from "react-router-dom";

import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";
import ProfileBox from "../../components/ProfileBox/ProfileBox";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";
import Settings from "../../components/Settings/Settings";
import { ROUTES } from "../../utils/constants";

import { useUserContext } from "@/contexts/user";
import { createMonogram } from "@/utils/user";

import "./Profile.scss";

const Profile: React.FC = () => {
  const { username } = useUserContext();

  return (
    <div className="profile">
      <Settings />
      <NavigationHeader to={ROUTES.HOME} />
      <div className="profile__content">
        <div>
          <ProfilePicture name={createMonogram(username)} version="big" />
        </div>
        <div className="profile__content__datas">
          <div className="profile__content__background grid"></div>
          <div className="profile__content__datas__user">
            <div className="profile-creation__username">Nickname</div>
            <div className="profile__username">{username}</div>
          </div>
          <ProfileBox
            title="Points"
            linkText="Claim your reward"
            link={ROUTES.CLAIMREWARD}
            showContent
            showPoints={false}
            shareable={false}
          />
          <Link to={ROUTES.HOWDOESITWORK} className="profile__content__datas__how-does-it-work">
            <ProfileBox title="How does it work?" showPoints={false} showContent={false} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
