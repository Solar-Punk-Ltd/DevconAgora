import RecentItem from "../RecentItem/RecentItem";
import "./RecentBox.scss";

interface RecentBoxProps {}

const RecentBox: React.FC<RecentBoxProps> = ({}) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div>Recent</div>
        <div style={{ textDecoration: "underline" }}>All</div>
      </div>
      <RecentItem />
      <RecentItem />
      <RecentItem />
    </div>
  );
};

export default RecentBox;
