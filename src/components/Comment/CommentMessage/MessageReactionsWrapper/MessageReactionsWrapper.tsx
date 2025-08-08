import { MessageReaction } from "../MessageReaction/MessageReaction";

import "./MessageReactionsWrapper.scss";

import { ReactionData } from "@/hooks/useSwarmComment";

interface MessageReactionsWrapperProps {
  reactions: ReactionData[];
  onEmojiClick: (emoji: string) => void;
  ownMessage?: boolean;
  isLoading?: boolean;
  loadingEmoji?: string;
  disabled?: boolean;
}

export function MessageReactionsWrapper({
  reactions,
  onEmojiClick,
  ownMessage = false,
  isLoading = false,
  loadingEmoji = "",
  disabled = false,
}: MessageReactionsWrapperProps) {
  if (reactions.length === 0) {
    return null;
  }

  return (
    <div className={`message-reactions-wrapper ${ownMessage ? "own-message" : ""}`}>
      {reactions.map((reaction) => (
        <MessageReaction
          key={reaction.emoji}
          emoji={reaction.emoji}
          count={reaction.count}
          isUserReaction={reaction.hasUserReacted}
          onClick={() => !disabled && onEmojiClick(reaction.emoji)}
          isLoading={isLoading && loadingEmoji === reaction.emoji}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
