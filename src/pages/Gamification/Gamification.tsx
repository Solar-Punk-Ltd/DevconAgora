import React from "react";
import "./Gamification.scss";
// import AlertIndicator from "./AlertIndicator/AlertIndicator";
// import ProfileIndicator from "../../components/ProfileIndicator/ProfileIndicator";
// import { Link } from "react-router-dom";
import CloseIcon from "../../assets/close.png";
import GamificationIcon from "../../assets/gamification-icon.png";

const Gamification: React.FC = () => {
  return (
    <div
      style={{
        padding: "20px",
        boxSizing: "border-box",

        width: "100%",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          boxShadow: "0px 2px 4px 0px #1F1F231A",
          borderRadius: "8px",
          backgroundColor: "white",
          padding: "6px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "end", width: "100%" }}>
          <img src={CloseIcon} alt="" width="24px" height="24px" />
        </div>
        <div
          style={{
            marginTop: "60px",
          }}
        >
          <img src={GamificationIcon} alt="" width="252px" height="252px" />
        </div>
        <div
          style={{
            fontSize: "18px",
            fontWeight: "700",
            width: "183px",
            textAlign: "center",
          }}
        >
          You got your first point.
        </div>
        <div
          style={{
            fontSize: "12px",
            fontWeight: "700",
            width: "183px",
            textAlign: "center",
            marginTop: "12px",
          }}
        >
          9 more more points and you get the 10 BBZ tokens
        </div>
      </div>
    </div>
  );
};

export default Gamification;
