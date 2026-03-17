import React, { useMemo, useState } from "react";

import { MessageSender } from "../MessageSender/MessageSender";

import "./Comment.scss";

import { Button } from "@/components/Button/Button";
import { CommentMessage } from "@/components/Comment/CommentMessage/CommentMessage";
import { ScrollableMessageList } from "@/components/Comment/ScrollableMessageList/ScrollableMessageList";
import { ThreadView } from "@/components/Comment/ThreadView/ThreadView";
import { DEFAULT_POLL_INTERVAL } from "@/constants/app";
import { useUserContext } from "@/contexts/user";
import { useSwarmComment, VisibleMessage } from "@/hooks/useSwarmComment";
import { getTopic } from "@/utils/bee";
import { deriveStableKey } from "@/utils/user";

interface CommentProps {
  sessionId: string;
  isSpacesTalk: boolean;
}

const profileColors = [
  "#FF6B6B", // Coral Red
  "#FFD93D", // Golden Yellow
  "#6BCB77", // Soft Green
  "#4D96FF", // Bright Blue
  "#FFAD69", // Soft Orange
  "#C084FC", // Pastel Purple
  "#F87171", // Warm Salmon
  "#34D399", // Emerald
  "#FBBF24", // Amber
  "#60A5FA", // Sky Blue
];

function getColorForName(name: string): string {
  const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return profileColors[hash % profileColors.length];
}

export const Comment: React.FC<CommentProps> = ({ sessionId, isSpacesTalk }) => {
  const { username, keys, isSwarmEnabled, identity } = useUserContext();
  const [selectedMessage, setSelectedMessage] = useState<VisibleMessage | null>(null);
  const [isThreadView, setIsThreadView] = useState(false);
  const [reactionLoadingState, setReactionLoadingState] = useState<Record<string, string>>({});
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isSendingThreadMessage, setIsSendingThreadMessage] = useState(false);

  const beeUrl = process.env.BEE_API_URL;
  if (!beeUrl) {
    return (
      <div className="comment-container">
        <div className="comment-error">Critical error: BEE API URL is not configured.</div>
      </div>
    );
  }

  const topic = getTopic(sessionId);

  // When Swarm is enabled and no local key is available, derive a stable
  // placeholder key purely for SwarmComment initialization (read-only display).
  // This key is NEVER used to send messages — sending is gated below.
  const commentPrivateKey = useMemo(() => {
    if (keys.private) return keys.private;
    if (isSwarmEnabled && identity?.id) return deriveStableKey(identity.id);
    return "";
  }, [keys.private, isSwarmEnabled, identity?.id]);

  // Resolve the current user's Ethereum address for own-message highlighting.
  // Legacy path: derived from keys.public. Swarm path: from identity.
  const userAddress = isSwarmEnabled
    ? (identity?.address ?? "")
    : keys.public;

  // Sending is only available on the legacy (direct Bee) path.
  // Phase 4 will enable sending via SwarmIdClient SOC writer.
  const canComment = !isSwarmEnabled && Boolean(keys.private);

  const commentConfig = useMemo(
    () => ({
      user: {
        nickname: username,
        privateKey: commentPrivateKey,
      },
      infra: {
        beeUrl,
        stamp: process.env.STAMP,
        topic,
        pollInterval: DEFAULT_POLL_INTERVAL,
      },
    }),
    [username, commentPrivateKey, topic, beeUrl]
  );

  const {
    commentLoading,
    messagesLoading,
    groupedReactions,
    simpleMessages,
    getThreadMessages,
    sendMessage,
    sendReaction,
    sendReply,
    fetchPreviousMessages,
    hasPreviousMessages,
    retrySendMessage,
    error,
    isSwarmCommentReady,
  } = useSwarmComment(commentConfig, sessionId, isSpacesTalk);

  const shouldShowLoadMore = () => {
    return !commentLoading && isSwarmCommentReady && !messagesLoading && hasPreviousMessages();
  };

  const handleMessageSending = async (text: string) => {
    if (!isSwarmCommentReady || !canComment) return;

    try {
      setIsSendingMessage(true);
      await sendMessage(text);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleEmojiReaction = async (messageId: string, emoji: string) => {
    if (!isSwarmCommentReady || !canComment) return;

    const loadingKey = `${messageId}-${emoji}`;
    if (reactionLoadingState[loadingKey]) return;

    try {
      setReactionLoadingState((prev) => ({ ...prev, [loadingKey]: emoji }));
      await sendReaction(messageId, emoji);
    } finally {
      setTimeout(() => {
        setReactionLoadingState((prev) => {
          const { [loadingKey]: _, ...rest } = prev;
          return rest;
        });
      }, 500);
    }
  };

  const handleThreadReply = (message: VisibleMessage) => {
    setSelectedMessage(message);
    setIsThreadView(true);
  };

  const handleBackToMain = () => {
    setIsThreadView(false);
    setSelectedMessage(null);
  };

  const handleThreadMessageSending = async (text: string) => {
    if (!isSwarmCommentReady || !canComment || !selectedMessage) return;

    try {
      setIsSendingThreadMessage(true);
      await sendReply(selectedMessage.id, text);
    } finally {
      setIsSendingThreadMessage(false);
    }
  };

  const isAnyOperationLoading = Object.keys(reactionLoadingState).length > 0 || isSendingMessage || isSendingThreadMessage;

  if (error) {
    return (
      <div className="comment-container">
        <div className="comment-error">Critical error: {error.message}. Please check node availability status.</div>
      </div>
    );
  }

  return (
    <div className="comment-container">
      {isThreadView && selectedMessage ? (
        <ThreadView
          originalMessage={selectedMessage}
          originalMessageReactions={groupedReactions[selectedMessage.id] || []}
          threadMessages={getThreadMessages(selectedMessage.id).messages}
          groupedReactions={groupedReactions}
          onBack={handleBackToMain}
          onSendMessage={handleThreadMessageSending}
          onEmojiReaction={handleEmojiReaction}
          onRetry={retrySendMessage}
          getColorForName={getColorForName}
          currentUserAddress={userAddress}
          reactionLoadingState={reactionLoadingState}
          disabled={isAnyOperationLoading}
        />
      ) : (
        <>
          {commentLoading && (
            <div className="comment-loading-overlay">
              <div className="comment-loading">Loading comments...</div>
            </div>
          )}
          {shouldShowLoadMore() && (
            <Button onClick={fetchPreviousMessages} className="comment-load-more">
              Load more messages
            </Button>
          )}

          {messagesLoading && <div className="comment-loading">Loading messages...</div>}
          {simpleMessages.length > 0 && (
            <ScrollableMessageList
              items={simpleMessages}
              renderItem={(item) => (
                <CommentMessage
                  timeStamp={item.timestamp}
                  message={item.message}
                  received={Boolean(item.received)}
                  error={Boolean(item.error)}
                  name={item.username}
                  profileColor={getColorForName(item.username)}
                  ownMessage={Boolean(userAddress) && item.address === userAddress}
                  reactions={groupedReactions[item.id] || []}
                  threadCount={getThreadMessages(item.id).count}
                  onRetry={() => retrySendMessage(item)}
                  onEmojiReaction={(emoji) => handleEmojiReaction(item.id, emoji)}
                  onThreadReply={() => handleThreadReply(item)}
                  isReactionLoading={Object.keys(reactionLoadingState).some((key) => key.startsWith(item.id))}
                  loadingReactionEmoji={Object.entries(reactionLoadingState).find(([key]) => key.startsWith(item.id))?.[1] || ""}
                  disabled={isAnyOperationLoading}
                />
              )}
            />
          )}

          {!commentLoading && canComment && <MessageSender onSend={handleMessageSending} disabled={isAnyOperationLoading} />}
        </>
      )}
    </div>
  );
};
