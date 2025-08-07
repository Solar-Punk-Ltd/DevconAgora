import clsx from "clsx";

import "./ProfilePicture.scss";

interface ProfilePictureProps {
  name: string;
  color: string;
  ownMessage?: boolean;
}

export function ProfilePicture({
  name,
  color,
  ownMessage = false,
}: ProfilePictureProps) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div
      className={clsx("profile-picture", { "own-message": ownMessage })}
      role="profile-picture"
      style={{ backgroundColor: color }}
      data-username={name}
    >
      {initial}
    </div>
  );
}
