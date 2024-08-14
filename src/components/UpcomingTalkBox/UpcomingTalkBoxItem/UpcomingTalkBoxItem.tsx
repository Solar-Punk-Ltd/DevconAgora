import "./UpcomingTalkBoxItem.scss";

interface UpcomingTalkBoxItemProps {
  key: string
  title: string
}

const UpcomingTalkBoxItem: React.FC<UpcomingTalkBoxItemProps> = ({ title }) => {
  return (
    <div
      style={{
        width: "118px",
        height: "92px",
        borderRadius: "8px",
        backgroundColor: "white",
      }}
    >
      <p>{title}</p>
    </div>
  );
};

export default UpcomingTalkBoxItem;
