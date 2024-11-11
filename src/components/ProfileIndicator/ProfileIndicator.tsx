import React from "react";
import "./ProfileIndicator.scss";
import ProfileAlert from "./ProfileAlert/ProfileAlert";

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
        <img src={process.env.ASSETS_URL + "/assets/mini-profile-icon.png"} alt="" width="40px" height="40px" />
        <ProfileAlert value={alertValue} />
      </div>
    </div>
  );
};

export default ProfileIndicator;
