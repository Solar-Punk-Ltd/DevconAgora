import "./UpcomingTalkBox.scss";
import UpcomingTalkBoxItem from "./UpcomingTalkBoxItem/UpcomingTalkBoxItem";

interface UpcomingTalkBoxProps {}

const UpcomingTalkBox: React.FC<UpcomingTalkBoxProps> = ({}) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div>Upcoming talks</div>
        <div style={{ textDecoration: "underline" }}>All</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <UpcomingTalkBoxItem />
        <UpcomingTalkBoxItem />
        <UpcomingTalkBoxItem />
      </div>
    </div>
  );
};

export default UpcomingTalkBox;
