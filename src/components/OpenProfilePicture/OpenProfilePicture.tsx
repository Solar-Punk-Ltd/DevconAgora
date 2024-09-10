import React from "react";
import "./OpenProfilePicture.scss";
import clsx from "clsx";

interface OpenProfilePictureProps {
  name: string;
  version?: "big" | "small";
}

const OpenProfilePicture: React.FC<OpenProfilePictureProps> = ({
  name,
  version,
}) => {
  return (
    <div
      className={clsx("openprofile-picture", {
        "openprofile-picture--big": version === "big",
        "openprofile-picture--small": version === "small",
      })}
    >
      {name}
    </div>
  );
};

export default OpenProfilePicture;
