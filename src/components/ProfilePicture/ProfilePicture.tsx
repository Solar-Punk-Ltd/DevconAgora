import React from "react";
import "./ProfilePicture.scss";
import clsx from "clsx";

interface ProfilePictureProps {
  name: string;
  version?: "big" | "small";
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ name, version }) => {
  return (
    <div
      className={clsx("profile-picture", {
        "profile-picture--big": version === "big",
        "profile-picture--small": version === "small",
      })}
    >
      {name}
    </div>
  );
};

export default ProfilePicture;
