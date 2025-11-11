import clsx from "clsx";

import "./CommentProfilePicture.scss";

interface CommentProfilePictureProps {
  name: string;
  color?: string;
  ownMessage?: boolean;
}

export function CommentProfilePicture({ name, color, ownMessage = false }: CommentProfilePictureProps) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div
      className={clsx("comment-profile-picture", { "own-message": ownMessage })}
      role="comment-profile-picture"
      style={{ backgroundColor: color ? color : "var(--bbw-blue)" }}
      data-username={name}
    >
      {initial}
    </div>
  );
}
