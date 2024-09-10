import React from "react";
import { Link } from "react-router-dom";
import editIconImage from "../../assets/edit-icon.png";
import "./OpenProfile.scss";
import OpenProfilePicture from "../../components/OpenProfilePicture/OpenProfilePicture";
import DefaultButton from "../../components/DefaultButton/DefaultButton";

const OpenProfile: React.FC = () => {
  return (
    <>
      <div className="openprofile-page">
        <div className="openprofile-page__header">Open your profile</div>
        <OpenProfilePicture name="CM" version="big" />
        <div>
          <div className="openprofile-page__username">Name</div>
          <div className="openprofile-page__username-edit">
            <div>Chain Master</div>

            <img src={editIconImage} alt="" width={24} height={24} />
          </div>
        </div>
        <div className="bottom">
          <Link to="/home">
            <DefaultButton>Start Building Your Community</DefaultButton>
          </Link>
        </div>
      </div>
    </>
  );
};

export default OpenProfile;
