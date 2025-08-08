import clsx from "clsx";
import { useState } from "react";

import { MessageActions } from "./MessageActions/MessageActions";
import { MessageReactionsWrapper } from "./MessageReactionsWrapper/MessageReactionsWrapper";
import { MessageThreadWrapper } from "./MessageThreadWrapper/MessageThreadWrapper";
import { ProfilePicture } from "./ProfilePicture/ProfilePicture";

import "./CommentMessage.scss";

import { ReactionData } from "@/hooks/useSwarmComment";

interface CommentMessageProps {
  message: string;
  name: string;
  profileColor: string;
  ownMessage?: boolean;
  received: boolean;
  error: boolean;
  reactions?: ReactionData[];
  threadCount?: number;
  onEmojiReaction: (emoji: string) => void;
  onRetry?: () => void;
  onThreadReply?: () => void;
  isReactionLoading?: boolean;
  loadingReactionEmoji?: string;
  disabled?: boolean;
}

export function CommentMessage({
  message,
  name,
  profileColor,
  ownMessage = false,
  received,
  error,
  reactions = [],
  threadCount = 0,
  onRetry,
  onEmojiReaction,
  onThreadReply,
  isReactionLoading = false,
  loadingReactionEmoji = "",
  disabled = false,
}: CommentMessageProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={clsx("comment-message", { "own-message": ownMessage })} onClick={() => setIsHovered((prev) => !prev)}>
      <ProfilePicture name={name} color={profileColor} ownMessage={ownMessage} />

      <div
        className={clsx("comment-message-text", {
          "comment-message-error": error,
          "not-received": !received,
        })}
      >
        <span className="message">{message}</span>

        {error && onRetry && (
          <button className="retry-button" onClick={onRetry}>
            Retry
          </button>
        )}

        <MessageReactionsWrapper
          reactions={reactions}
          onEmojiClick={onEmojiReaction}
          ownMessage={ownMessage}
          isLoading={isReactionLoading}
          loadingEmoji={loadingReactionEmoji}
          disabled={disabled}
        />

        <MessageThreadWrapper threadCount={threadCount} onThreadClick={onThreadReply} disabled={disabled} />
      </div>

      <MessageActions
        visible={isHovered && received && !error}
        onEmojiClick={onEmojiReaction}
        onThreadClick={onThreadReply}
        ownMessage={ownMessage}
        isReactionLoading={isReactionLoading}
        disabled={disabled}
      />
    </div>
  );
}
