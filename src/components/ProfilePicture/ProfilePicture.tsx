import clsx from "clsx";
import React from "react";

import "./ProfilePicture.scss";

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
