import React from "react";

import miniProfileIcon from "../../assets/mini-profile-icon.png";

import ProfileAlert from "./ProfileAlert/ProfileAlert";

import "./ProfileIndicator.scss";

interface ProfileIndicatorProps {
  alertValue: number;
}

const ProfileIndicator: React.FC<ProfileIndicatorProps> = ({ alertValue }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ height: "40px" }}>
        <img src={miniProfileIcon} alt="" width="40px" height="40px" />
        <ProfileAlert value={alertValue} />
      </div>
    </div>
  );
};

export default ProfileIndicator;
