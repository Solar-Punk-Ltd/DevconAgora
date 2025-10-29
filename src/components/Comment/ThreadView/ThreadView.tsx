import "./ThreadView.scss";

import { Button } from "@/components/Button/Button";
import { CommentMessage } from "@/components/Comment/CommentMessage/CommentMessage";
import { ScrollableMessageList } from "@/components/Comment/ScrollableMessageList/ScrollableMessageList";
import LeftNavigationIcon from "@/components/icons/LeftNavigationIcon/LeftNavigationIcon";
import { MessageSender } from "@/components/MessageSender/MessageSender";
import { ReactionData, VisibleMessage } from "@/hooks/useSwarmComment";

interface ThreadViewProps {
  originalMessage: VisibleMessage;
  originalMessageReactions: ReactionData[];
  threadMessages: VisibleMessage[];
  groupedReactions: Record<string, ReactionData[]>;
  onBack: () => void;
  onSendMessage: (message: string) => void;
  onEmojiReaction: (messageId: string, emoji: string) => void;
  onRetry: (message: VisibleMessage) => void;
  getColorForName: (name: string) => string;
  currentUserAddress: string;
  reactionLoadingState?: Record<string, string>;
  disabled?: boolean;
}

export function ThreadView({
  originalMessage,
  originalMessageReactions,
  threadMessages,
  groupedReactions,
  onBack,
  onSendMessage,
  onEmojiReaction,
  onRetry,
  getColorForName,
  currentUserAddress,
  reactionLoadingState = {},
  disabled = false,
}: ThreadViewProps) {
  return (
    <div className="thread-view">
      <div className="thread-header">
        <Button onClick={onBack} className="back-button">
          <LeftNavigationIcon color="white" />
        </Button>
        <h3 className="thread-title">Thread</h3>
      </div>

      <div className="original-message-container">
        <CommentMessage
          key={originalMessage.id}
          message={originalMessage.message}
          received={Boolean(originalMessage.received)}
          error={Boolean(originalMessage.error)}
          name={originalMessage.username}
          profileColor={getColorForName(originalMessage.username)}
          ownMessage={originalMessage.address === currentUserAddress}
          reactions={originalMessageReactions}
          onEmojiReaction={(emoji) => onEmojiReaction(originalMessage.id, emoji)}
          onRetry={() => onRetry(originalMessage)}
          isReactionLoading={Object.keys(reactionLoadingState).some((key) => key.startsWith(originalMessage.id))}
          loadingReactionEmoji={Object.entries(reactionLoadingState).find(([key]) => key.startsWith(originalMessage.id))?.[1] || ""}
          disabled={disabled}
        />
      </div>

      <div className="thread-messages-container">
        {threadMessages.length > 0 ? (
          <ScrollableMessageList
            items={threadMessages}
            renderItem={(item) => (
              <CommentMessage
                message={item.message}
                received={Boolean(item.received)}
                error={Boolean(item.error)}
                name={item.username}
                profileColor={getColorForName(item.username)}
                ownMessage={item.address === currentUserAddress}
                reactions={groupedReactions[item.id] || []}
                onEmojiReaction={(emoji) => onEmojiReaction(item.id, emoji)}
                onRetry={() => onRetry(item)}
                isReactionLoading={Object.keys(reactionLoadingState).some((key) => key.startsWith(item.id))}
                loadingReactionEmoji={Object.entries(reactionLoadingState).find(([key]) => key.startsWith(item.id))?.[1] || ""}
                disabled={disabled}
              />
            )}
          />
        ) : (
          <div className="no-thread-messages">No replies yet.</div>
        )}
      </div>

      <MessageSender onSend={onSendMessage} disabled={disabled} />
    </div>
  );
}
