import React from "react";

interface RightArrowIconProps {
  color?: string;
}

const RightArrowIcon: React.FC<RightArrowIconProps> = ({ color }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.8415 12L10.1204 8.8254C9.94067 8.61574 9.96495 8.30009 10.1746 8.12038C10.3843 7.94067 10.6999 7.96495 10.8796 8.17461L13.8796 11.6746C14.0401 11.8619 14.0401 12.1382 13.8796 12.3254L10.8796 15.8254C10.6999 16.0351 10.3843 16.0593 10.1746 15.8796C9.96495 15.6999 9.94067 15.3843 10.1204 15.1746L12.8415 12Z"
        fill={color ? color : "#2B2E36"}
      />
    </svg>
  );
};

export default RightArrowIcon;
