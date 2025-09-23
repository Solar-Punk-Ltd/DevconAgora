import React from "react";

interface CloseIconProps {
  color?: string;
  onClick?: () => void;
}

const CopyIcon: React.FC<CloseIconProps> = ({ color, onClick }) => {
  return (
    <div onClick={onClick} style={{ display: "flex" }}>
      <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.5 6H2.5C1.397 6 0.5 6.897 0.5 8V18C0.5 19.103 1.397 20 2.5 20H12.5C13.603 20 14.5 19.103 14.5 18V8C14.5 6.897 13.603 6 12.5 6Z"
          fill={color ? color : "white"}
        />
        <path
          d="M18.5 0H8.5C7.96957 0 7.46086 0.210714 7.08579 0.585786C6.71071 0.960859 6.5 1.46957 6.5 2V4H14.5C15.0304 4 15.5391 4.21071 15.9142 4.58579C16.2893 4.96086 16.5 5.46957 16.5 6V14H18.5C19.0304 14 19.5391 13.7893 19.9142 13.4142C20.2893 13.0391 20.5 12.5304 20.5 12V2C20.5 1.46957 20.2893 0.960859 19.9142 0.585786C19.5391 0.210714 19.0304 0 18.5 0Z"
          fill={color ? color : "white"}
        />
      </svg>
    </div>
  );
};

export default CopyIcon;
