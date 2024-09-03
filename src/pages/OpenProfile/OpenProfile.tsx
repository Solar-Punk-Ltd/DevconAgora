import React from "react";
import { Link } from "react-router-dom";
import profileImage from "../../assets/profile.png";
import editIconImage from "../../assets/edit-icon.png";
import "./OpenProfile.scss";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";

const OpenProfile: React.FC = () => {
  return (
    <>
      <div className="welcome-layout welcome-font">
        <div className="welcome-content">
          <div className="openprofile-header">Open your profile</div>
          <img src={profileImage} alt="" width={242} height={242} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "15px",
            }}
          >
            <div className="username" style={{ marginRight: "10px" }}>
              ChainMasterAlex
            </div>
            <img src={editIconImage} alt="" width={24} height={24} />
          </div>
        </div>
        <div className="bottom">
          <Link to="/mainprofile">
            <WelcomeButton>Start Building Your Community</WelcomeButton>
          </Link>
        </div>
      </div>
    </>
  );
};

export default OpenProfile;
