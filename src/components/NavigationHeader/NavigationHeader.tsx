import React from "react";
import "./NavigationHeader.scss";
import BackArrowNavigationIcon from "../../assets/back-arrow-navigation.png";
import { Link } from "react-router-dom";

const NavigationHeader: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "32px",
        alignItems: "center",
        marginBottom: "28px",
      }}
    >
      <Link to="/mainprofile">
        <div>
          <img src={BackArrowNavigationIcon} alt="" width="32" height="32" />
        </div>
      </Link>
      <div style={{ marginLeft: "16px", fontSize: "18px", fontWeight: "700" }}>
        Profile
      </div>
    </div>
  );
};

export default NavigationHeader;
