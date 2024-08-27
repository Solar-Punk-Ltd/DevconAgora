import React from "react";
import "./Header.scss";
// import AlertIndicator from "./AlertIndicator/AlertIndicator";
import ProfileIndicator from "../../components/ProfileIndicator/ProfileIndicator";
import { Link } from "react-router-dom";

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
        borderTop: "1px solid #e0e0e0",
        borderBottom: "1px solid #e0e0e0",
        padding: "15px",
      }}
    >
      <div style={{ fontSize: "24px", fontWeight: "700" }}>{name}</div>

      <div style={{ height: "40px" }}>
        <Link to="/profile">
          <ProfileIndicator alertValue={10} />
        </Link>
      </div>
    </div>
  );
};

export default Header;
