import React from "react";
import "./Header.scss";
// import AlertIndicator from "./AlertIndicator/AlertIndicator";
import ProfileIndicator from "../../components/ProfileIndicator/ProfileIndicator";

interface HeaderProps {
  name: string;
}

const Header: React.FC<HeaderProps> = ({ name }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>{name}</div>
      <div style={{ height: "40px" }}>
        <ProfileIndicator alertValue={10} />
      </div>
    </div>
  );
};

export default Header;
