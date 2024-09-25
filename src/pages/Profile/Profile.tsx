import React from "react";
import "./Profile.scss";
import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";
import { useGlobalState } from "../../GlobalStateContext";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";
import HomeBackground from "../../assets/welcome-glass-effect.png";
import ProfileBox from "../../components/ProfileBox/ProfileBox";
import { Link } from "react-router-dom";

const Profile: React.FC = () => {
  const { username, monogram, points } = useGlobalState();
  return (
    <div className="profile">
      <NavigationHeader to="/home" />
      <div className="profile__content">
        <div>
          <ProfilePicture name={monogram} version="big" />
        </div>
        <div className="profile__content__datas">
          <div className="profile__content__background">
            <img
              src={HomeBackground}
              alt=""
              className="profile__content__background__image"
            />
          </div>
          <div className="profile__content__datas__user">
            <div className="profile-creation__username">Nickname</div>
            <div className="profile__username">{username}</div>
          </div>
          <ProfileBox
            title="Points"
            link="Claim reward"
            points={points}
            showPoints={true}
            showContent={true}
          />
          <ProfileBox
            title="Get referal points"
            link="Share referal link"
            showPoints={false}
            showContent={true}
          />
          <Link
            to="/how-does-it-work"
            className="profile__content__datas__how-does-it-work"
          >
            <ProfileBox
              title="How does it work?"
              showPoints={false}
              showContent={false}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
