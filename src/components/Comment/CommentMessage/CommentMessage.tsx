import clsx from "clsx";
import { useState } from "react";

import { MessageActions } from "./MessageActions/MessageActions";
import { MessageReactionsWrapper } from "./MessageRectionsWrapper/MessageReactionsWrapper";
import { MessageThreadWrapper } from "./MessageThreadWrapper/MessageThreadWrapper";

import "./CommentMessage.scss";

import { ReactionData } from "@/hooks/useSwarmComment";
import { CommentProfilePicture } from "./CommentProfilePicture/CommentProfilePicture";

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
  timeStamp?: number;
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
  timeStamp,
}: CommentMessageProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={clsx("comment-message", { "own-message": ownMessage })} onClick={() => setIsHovered((prev) => !prev)}>
      <CommentProfilePicture name={name} ownMessage={ownMessage} />

      <div
        className={clsx("comment-message-text", {
          "comment-message-error": error,
          "not-received": !received,
        })}
      >
        <div className="message-container">
          <div>
            {name} {timeStamp ? new Date(timeStamp).toLocaleString() : ""}
          </div>

          <div className="message">{message}</div>
        </div>

        {error && onRetry && (
          <button className="retry-button" onClick={onRetry}>
            Retry
          </button>
        )}
        <div className="comment-message-reaction-wrapper">
          <div className="comment-message-reaction-wrapper__left">
            <MessageReactionsWrapper
              reactions={reactions}
              onEmojiClick={onEmojiReaction}
              ownMessage={ownMessage}
              isLoading={isReactionLoading}
              loadingEmoji={loadingReactionEmoji}
              disabled={disabled}
            />
          </div>
          <div className="comment-message-reaction-wrapper__right">
            <MessageThreadWrapper threadCount={threadCount} onThreadClick={onThreadReply} disabled={disabled} />
          </div>
        </div>
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
