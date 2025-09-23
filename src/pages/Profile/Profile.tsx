import React from "react";

import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
