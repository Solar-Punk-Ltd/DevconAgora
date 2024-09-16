import React from "react";
import HomeIcon from "../../assets/home.png";
import CalendarIcon from "../../assets/calendar.png";
import RoomsIcon from "../../assets/rooms.png";
import "./NavigationFooter.scss";
import { Link } from "react-router-dom";

const NavigationFooter: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "0",
        display: "flex",
        justifyContent: "center",
        gap: "40px",
        alignItems: "center",
        height: "56px",
        width: "100%",
        backgroundColor: "white",
        padding: "8px",
        boxSizing: "border-box",
        borderTop: "1px solid #C8C8CA",
        borderBottom: "1px solid #C8C8CA",
      }}
    >
      <Link to="/home">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <img src={HomeIcon} alt="" width="24px" height="24px" />
          <div style={{ fontSize: "12px" }}>Home</div>
        </div>
      </Link>
      <Link to="/agenda">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <img src={CalendarIcon} alt="" width="24px" height="24px" />
          <div style={{ fontSize: "12px" }}>Agenda</div>
        </div>
      </Link>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <img src={RoomsIcon} alt="" width="24px" height="24px" />
        <div style={{ fontSize: "12px" }}>Rooms</div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <img src={RoomsIcon} alt="" width="24px" height="24px" />
        <Link to="/test">
        <div style={{ fontSize: "12px" }}>Test</div>
        </Link>
      </div>
    </div>
    
  );
};

export default NavigationFooter;
