import "./RecentItem.scss";

interface RecentItemProps {}

const RecentItem: React.FC<RecentItemProps> = ({}) => {
  return (
    <div
      style={{
        height: "52px",
        borderRadius: "8px",
        backgroundColor: "white",
        marginBottom: "4px",
      }}
    ></div>
  );
};

export default RecentItem;
