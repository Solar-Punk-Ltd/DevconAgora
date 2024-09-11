import React from "react";
import "./OpenProfilePicture.scss";

interface OpenProfilePictureProps {
  name: string;
}

const OpenProfilePicture: React.FC<OpenProfilePictureProps> = ({ name }) => {
  return <div className="openprofile-picture">{name}</div>;
};

export default OpenProfilePicture;
