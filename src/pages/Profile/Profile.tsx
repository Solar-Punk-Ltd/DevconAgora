import React from "react";
import "./Profile.scss";
// import AlertIndicator from "./AlertIndicator/AlertIndicator";
import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";
import ProfilePicture from "../../assets/profile-page-profile-icon.png";
import QRcode from "../../assets/qr-code.png";

const Profile: React.FC = () => {
  return (
    <div>
      <NavigationHeader />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{ fontSize: "24px", fontWeight: "700", marginBottom: "16px" }}
        >
          ChainMasterAlex
        </div>
        <div style={{ marginBottom: "10px" }}>
          <img src={ProfilePicture} alt="" width="135px" height="135px" />
        </div>
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#949499",
            marginBottom: "10px",
            fontSize: "18px",
            fontWeight: "700",
            color: "white",
          }}
        >
          8 points
        </div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "700",
            textDecoration: "underline",
          }}
        >
          Claim your reward
        </div>
        <div
          style={{
            width: "100%",
            fontSize: "14px",
            fontWeight: "700",
            textAlign: "left",
            marginLeft: "17px",
          }}
        >
          Get referal points
        </div>
        <div
          style={{
            width: "100%",
            fontSize: "14px",
            fontWeight: "400",
            textAlign: "left",
            marginLeft: "17px",
            marginBottom: "14px",
          }}
        >
          Each active registration you got extra 2 points
        </div>
        <div>
          <img src={QRcode} alt="" width="171px" height="171px" />
        </div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "700",
            textDecoration: "underline",
          }}
        >
          Share referal link
        </div>
      </div>
    </div>
  );
};

export default Profile;
