import clsx from "clsx";
import React from "react";

import "./MessageReaction.scss";

interface MessageReactionProps {
  emoji: string;
  count: number;
  isUserReaction?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function MessageReaction({ emoji, count, isUserReaction = false, onClick, isLoading = false, disabled = false }: MessageReactionProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!isLoading && !disabled) {
      onClick?.();
    }
  };

  return (
    <button
      className={clsx("message-reaction", {
        "user-reaction": isUserReaction,
        loading: isLoading,
        disabled: disabled,
      })}
      onClick={handleClick}
      disabled={isLoading || disabled}
      title={disabled ? "Reactions disabled while loading" : isLoading ? "Sending reaction..." : `${count} reaction${count > 1 ? "s" : ""}`}
    >
      <span className="reaction-emoji">{isLoading ? "⏳" : emoji}</span>
      <span className="reaction-count">{count}</span>
    </button>
  );
}
