import { PrivateKey } from "@ethersphere/bee-js";
import React, { useCallback, useEffect, useState } from "react";

import "./Comment.scss";

import { Button } from "@/components/Button/Button";
import { CommentMessage } from "@/components/Comment/CommentMessage/CommentMessage";
import { MessageSender } from "@/components/Comment/MessageSender/MessageSender";
import { ScrollableMessageList } from "@/components/Comment/ScrollableMessageList/ScrollableMessageList";
import { ThreadView } from "@/components/Comment/ThreadView/ThreadView";
import { useGlobalState } from "@/contexts/global"; // todo: replace all relative imports with @
import { useSwarmComment, VisibleMessage } from "@/hooks/useSwarmComment";
import { TalkComments } from "@/types/talkComment";
import { getTopic } from "@/utils/bee";
import { CATEGORIES, MAX_PRELOADED_TALKS } from "@/utils/constants";

interface CommentProps {
  sessionId: string;
  username: string;
  signer: PrivateKey;
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

export const Comment: React.FC<CommentProps> = ({ sessionId, signer, username }) => {
  const { loadedTalks, setLoadedTalks, talkActivity, setTalkActivity, spacesActivity, setSpacesActivity } = useGlobalState();
  const [selectedMessage, setSelectedMessage] = useState<VisibleMessage | null>(null);
  const [isThreadView, setIsThreadView] = useState(false);
  const [reactionLoadingState, setReactionLoadingState] = useState<Record<string, string>>({});
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isSendingThreadMessage, setIsSendingThreadMessage] = useState(false);

  const topic = getTopic(sessionId, true);

  // TODO: why can it be undefined?
  const beeUrl = process.env.BEE_API_URL;
  if (!beeUrl) {
    return (
      <div className="comment-container">
        <div className="comment-error">Critical error: BEE API URL is not configured.</div>
      </div>
    );
  }

  // todo: useCallback if loadedTalks changes?
  const updateTalkActivity = () => {
    if (loadedTalks) {
      let tmpActivity: Map<string, bigint>;
      const isSpacesTalk = CATEGORIES.find((c) => c === sessionId);
      if (!isSpacesTalk) {
        tmpActivity = new Map(talkActivity);
      } else {
        tmpActivity = new Map(spacesActivity);
      }
      const foundIx = loadedTalks.findIndex((talk) => talk.talkId.includes(sessionId));
      if (foundIx > -1) {
        tmpActivity.set(sessionId, BigInt(loadedTalks[foundIx].messages.length));
      }

      if (!isSpacesTalk) {
        setTalkActivity(tmpActivity);
      } else {
        setSpacesActivity(tmpActivity);
      }
    }
  };

  // todo: useCallback if loadedTalks changes?
  const updateLoadedTalks = (messages: VisibleMessage[]) => {
    const prevLoadedTalks = [...(loadedTalks || [])];
    const newTalk: TalkComments = {
      talkId: sessionId,
      messages,
    };
    if (!loadedTalks || loadedTalks.length < MAX_PRELOADED_TALKS) {
      prevLoadedTalks.push(newTalk);
    } else {
      prevLoadedTalks.splice(0, 1, newTalk);
    }

    setLoadedTalks(prevLoadedTalks);
  };

  const onMessageReceived = useCallback(
    (messages: VisibleMessage[]) => {
      updateTalkActivity();
      updateLoadedTalks(messages);
    },
    [loadedTalks, talkActivity, spacesActivity, sessionId, setTalkActivity, setSpacesActivity, setLoadedTalks]
  );

  const {
    commentLoading,
    messagesLoading,
    groupedReactions,
    simpleMessages,
    setPreloadedMessages,
    getThreadMessages,
    sendMessage,
    sendReaction,
    sendReply,
    fetchPreviousMessages,
    hasPreviousMessages,
    retrySendMessage,
    error,
  } = useSwarmComment({
    user: {
      username,
      privateKey: signer.toHex(),
    },
    infra: {
      beeUrl,
      stamp: process.env.STAMP,
      topic,
    },
    onMessageReceived,
  });

  const setPreloadedTalks = useCallback(() => {
    if (loadedTalks) {
      const talk = loadedTalks.find((talk) => talk.talkId.includes(sessionId));
      if (talk) {
        setPreloadedMessages(talk.messages);
      }
    }
  }, [loadedTalks, sessionId, setPreloadedMessages]);

  // TODO: set history load flag to false
  useEffect(() => {
    if (!commentLoading) {
      setPreloadedTalks();
    }
  }, [commentLoading, setPreloadedTalks]);

  const handleMessageSending = async (text: string) => {
    try {
      setIsSendingMessage(true);
      await sendMessage(text);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleEmojiReaction = async (messageId: string, emoji: string) => {
    // Prevent multiple reactions on the same message-emoji combination
    const loadingKey = `${messageId}-${emoji}`;
    if (reactionLoadingState[loadingKey]) return;

    try {
      setReactionLoadingState((prev) => ({ ...prev, [loadingKey]: emoji }));
      await sendReaction(messageId, emoji);
    } finally {
      // Clear loading state after a short delay to prevent rapid clicking
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
    if (selectedMessage) {
      try {
        setIsSendingThreadMessage(true);
        await sendReply(selectedMessage.id, text);
      } finally {
        setIsSendingThreadMessage(false);
      }
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
          currentUserAddress={signer.publicKey().address().toString()}
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
          {!commentLoading && hasPreviousMessages() && (
            <Button onClick={fetchPreviousMessages} className="comment-load-more">
              Load more messages
            </Button>
          )}

          {messagesLoading && <div className="comment-loading">Loading messages...</div>}
          {!messagesLoading && simpleMessages.length > 0 && (
            <ScrollableMessageList
              items={simpleMessages}
              renderItem={(item) => (
                <CommentMessage
                  key={item.id}
                  message={item.message}
                  received={Boolean(item.received)}
                  error={Boolean(item.error)}
                  name={item.username}
                  profileColor={getColorForName(item.username)}
                  ownMessage={item.address === signer.publicKey().address().toString()}
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

          {!commentLoading && <MessageSender onSend={handleMessageSending} disabled={isAnyOperationLoading} />}
        </>
      )}
    </div>
  );
};
