import React from "react";
import "./Stage.scss";
import PlaceIcon from "../icons/PlaceIcon/PlaceIcon";

interface HomeHeaderProps {
  name?: string;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ name }) => {
  return (
    <div className="stage">
      <PlaceIcon />
      {name}
    </div>
  );
};

export default HomeHeader;
