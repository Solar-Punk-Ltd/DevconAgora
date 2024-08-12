import "./Header.scss";
import miniProfileIcon from "../../assets/mini-profile-icon.png";
import AlertIndicator from "./AlertIndicator/AlertIndicator";

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
        <img src={miniProfileIcon} alt="" width="40px" height="40px" />
        <AlertIndicator value={10} />
      </div>
    </div>
  );
};

export default Header;
