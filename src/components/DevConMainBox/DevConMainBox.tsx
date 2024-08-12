import "./DevConMainBox.scss";
import rightArrow from "../../assets/right-arrow.png";
import devConMainBoxLine from "../../assets/devconmainbox-line.png";

interface DevConMainBoxProps {}

const DevConMainBox: React.FC<DevConMainBoxProps> = ({}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "white",
        borderRadius: "8px",
        height: "48px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: "18px", fontWeight: "400" }}>Devcon Lounge</div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: "113px",
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            marginRight: "20px",
          }}
        >
          <div>110</div>
          <div>active</div>
          <div style={{ display: "flex" }}>
            <img src={devConMainBoxLine} alt="" width="113px" height="4px" />
          </div>
        </div>
        <div>
          <img src={rightArrow} alt="" />
        </div>
      </div>
    </div>
  );
};

export default DevConMainBox;
