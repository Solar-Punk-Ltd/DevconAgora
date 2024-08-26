import React from "react";
import "./DevConMainBox.scss";
import { Link } from "react-router-dom";

const DevConMainBox: React.FC = () => {
  return (
    <Link to="/devconlounge">
      <div
        style={{
          // display: "flex",
          // justifyContent: "space-between",
          // alignItems: "center",
          padding: "10px",
          backgroundColor: "white",
          borderRadius: "8px",
          // height: "48px",
          boxSizing: "border-box",
          boxShadow: "0px 2px 4px 0px #1F1F231A",
        }}
      >
        <div
          style={{ fontSize: "18px", fontWeight: "400", marginBottom: "8px" }}
        >
          Devcon chatroom
        </div>
        <div style={{ fontSize: "12px", marginBottom: "8px" }}>
          Share your tought, chat with anybody without moderation and collect
          the reward.
        </div>
        <div style={{ fontSize: "12px", fontWeight: "700" }}>
          110 active visitors
        </div>
      </div>
    </Link>
  );
};

export default DevConMainBox;
