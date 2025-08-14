import { FeedIndex } from "@ethersphere/bee-js";
import { MessageData, MessageType } from "@solarpunkltd/comment-system";
import { CommentSettings, EVENTS, PreloadOptions, SwarmComment } from "@solarpunkltd/swarm-comment-js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useGlobalState } from "@/contexts/global";
import { CATEGORIES, MAX_PRELOADED_TALKS } from "@/utils/constants";
import { getActivityHelper } from "./usePreloadTalks";

export interface VisibleMessage extends MessageData {
  requested?: boolean;
  uploaded?: boolean;
  received?: boolean;
  error?: boolean;
}

export interface ReactionData {
  emoji: string;
  count: number;
  users: string[];
  hasUserReacted: boolean;
}

const buildReactionGroups = (reactionMessages: MessageData[]) => {
  const groups: Record<string, Record<string, Record<string, number>>> = {};

  reactionMessages.forEach((reaction) => {
    const targetId = reaction.targetMessageId!;
    const emoji = reaction.message;
    const username = reaction.username;

    if (!groups[targetId]) groups[targetId] = {};
    if (!groups[targetId][emoji]) groups[targetId][emoji] = {};
    if (!groups[targetId][emoji][username]) groups[targetId][emoji][username] = 0;

    groups[targetId][emoji][username]++;
  });

  return groups;
};

const calculateActiveReactions = (
  reactionGroups: Record<string, Record<string, Record<string, number>>>,
  currentUserNickname: string
): Record<string, ReactionData[]> => {
  const newReactions: Record<string, ReactionData[]> = {};

  Object.entries(reactionGroups).forEach(([targetId, emojis]) => {
    const reactions: ReactionData[] = [];

    Object.entries(emojis).forEach(([emoji, users]) => {
      const activeUsers: string[] = [];
      let hasUserReacted = false;

      Object.entries(users).forEach(([username, count]) => {
        // If count is odd, the user has this reaction active
        if (count % 2 === 1) {
          activeUsers.push(username);
          if (username === currentUserNickname) {
            hasUserReacted = true;
          }
        }
      });

      // Only add reaction if there are active users
      if (activeUsers.length > 0) {
        reactions.push({
          emoji,
          count: activeUsers.length,
          users: activeUsers,
          hasUserReacted,
        });
      }
    });

    if (reactions.length > 0) {
      newReactions[targetId] = reactions;
    }
  });

  return newReactions;
};

export const useSwarmComment = ({ user, infra }: CommentSettings, sessionId: string) => {
  const commentRef = useRef<SwarmComment | null>(null);
  const { loadedTalks, setLoadedTalks, setTalkActivity, setSpacesActivity } = useGlobalState();

  const preloadedData = useMemo(() => {
    if (loadedTalks) {
      const talk = loadedTalks.find((t) => t.talkId === infra.topic);
      return {
        messages: talk?.messages ?? [],
        reactions: talk?.reactions ?? [],
        isPreloaded: true,
      };
    }
    return {
      messages: [],
      reactions: [],
      isPreloaded: false,
    };
  }, [loadedTalks, infra.topic]);

  const initialMessages = useMemo(() => {
    // Combine preloaded messages and reactions into a single array with proper VisibleMessage format
    const allMessages: VisibleMessage[] = [
      ...preloadedData.messages.map((msg) => ({ ...msg, received: true })),
      ...preloadedData.reactions.map((reaction) => ({ ...reaction, received: true })),
    ];

    // Sort by timestamp to maintain chronological order
    return allMessages.sort((a, b) => a.timestamp - b.timestamp);
  }, [preloadedData]);

  const [messages, setMessages] = useState<VisibleMessage[]>(initialMessages);
  const [commentLoading, setCommentLoading] = useState<boolean>(!preloadedData.isPreloaded);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);

  const reactionMessages = useMemo(() => messages.filter((msg) => msg.type === MessageType.REACTION && msg.targetMessageId), [messages]);

  const simpleMessages = useMemo(() => messages.filter((msg) => msg.type === MessageType.TEXT), [messages]);

  const threadMessages = useMemo(() => {
    return messages.filter((msg) => msg.type === MessageType.THREAD);
  }, [messages]);

  const getThreadMessages = useCallback(
    (parentMessageId: string) => {
      const messages = threadMessages.filter((msg) => msg.targetMessageId === parentMessageId);

      return {
        messages: messages.sort((a, b) => a.timestamp - b.timestamp),
        count: messages.length,
      };
    },
    [threadMessages]
  );

  const groupedReactions = useMemo(() => {
    const reactionGroups = buildReactionGroups(reactionMessages);
    return calculateActiveReactions(reactionGroups, user.nickname);
  }, [reactionMessages, user.nickname]);

  // todo: does a reaction count as an activity or just the comment ?
  const updateTalkActivity = useCallback(
    (messages: VisibleMessage[]) => {
      if (messages.length === 0) return;

      const latestMessage = messages[messages.length - 1];
      const latestIndex = new FeedIndex(latestMessage.index).toBigInt();
      const isSpacesTalk = CATEGORIES.includes(sessionId);

      if (!isSpacesTalk) {
        setTalkActivity((prevActivity) => {
          const newActivity = new Map(prevActivity);
          newActivity.set(infra.topic, latestIndex);
          return newActivity;
        });
      } else {
        setSpacesActivity((prevActivity) => {
          const newActivity = new Map(prevActivity);
          newActivity.set(sessionId, latestIndex);
          return newActivity;
        });
      }
    },
    [sessionId, setTalkActivity, setSpacesActivity]
  );
  // todo: sometimes even if preloadedTalks is appended, after returning to the same talk messages are still not extended with the loaded comments (load more)
  const updateLoadedTalks = useCallback(
    (messages: VisibleMessage[]) => {
      setLoadedTalks((prevLoadedTalks) => {
        const currentLoadedTalks = [...(prevLoadedTalks || [])];
        const existingTalkIndex = currentLoadedTalks.findIndex((talk) => talk.talkId === infra.topic);

        const newTalk = {
          talkId: infra.topic,
          messages: messages.filter((msg) => msg.type === MessageType.TEXT || msg.type === MessageType.THREAD),
          reactions: messages.filter((msg) => msg.type === MessageType.REACTION && msg.targetMessageId),
        };
        // todo: do not replace spaces talks
        if (existingTalkIndex !== -1) {
          currentLoadedTalks[existingTalkIndex] = newTalk;
        } else if (currentLoadedTalks.length < MAX_PRELOADED_TALKS) {
          currentLoadedTalks.push(newTalk);
        } else {
          currentLoadedTalks[currentLoadedTalks.length - 1] = newTalk;
        }

        return currentLoadedTalks;
      });
    },
    [infra.topic]
  );

  const addMessage = useCallback((newMessage: VisibleMessage) => {
    setMessages((prevMessages) => {
      const existingIndex = prevMessages.findIndex((msg) => msg.id === newMessage.id);

      if (existingIndex !== -1) {
        const updated = [...prevMessages];
        updated[existingIndex] = { ...updated[existingIndex], ...newMessage };
        return commentRef.current?.orderMessages ? commentRef.current.orderMessages(updated) : updated;
      }

      const newMessages = [...prevMessages, newMessage];
      return commentRef.current?.orderMessages ? commentRef.current.orderMessages(newMessages) : newMessages;
    });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      updateLoadedTalks(messages);
      updateTalkActivity(messages);
    }
  }, [messages, updateLoadedTalks, updateTalkActivity]);

  useEffect(() => {
    if (commentRef.current) return;

    commentRef.current = new SwarmComment({ user, infra });

    const { on } = commentRef.current.getEmitter();

    const createMessageHandler = (updates: Partial<VisibleMessage>) => {
      return (d: MessageData | string) => {
        const data = typeof d === "string" ? JSON.parse(d) : d;
        const newMessage = { ...data, ...updates } as VisibleMessage;
        addMessage(newMessage);
      };
    };

    on(
      EVENTS.MESSAGE_REQUEST_INITIATED,
      createMessageHandler({
        error: false,
        requested: true,
      })
    );

    on(
      EVENTS.MESSAGE_REQUEST_UPLOADED,
      createMessageHandler({
        error: false,
        uploaded: true,
        received: true,
      })
    );

    on(
      EVENTS.MESSAGE_RECEIVED,
      createMessageHandler({
        error: false,
        received: true,
      })
    );

    on(EVENTS.MESSAGE_REQUEST_ERROR, createMessageHandler({ error: true }));

    on(EVENTS.LOADING_INIT, (loading: boolean) => {
      setCommentLoading(loading && !preloadedData.isPreloaded);
    });
    on(EVENTS.LOADING_PREVIOUS_MESSAGES, (loading: boolean) => setMessagesLoading(loading));
    on(EVENTS.CRITICAL_ERROR, (err: any) => setError(err));

    const preloadOptions: PreloadOptions = {};
    if (preloadedData.isPreloaded) {
      preloadOptions.firstIndex = getActivityHelper(preloadedData.messages, false);
      preloadOptions.latestIndex = getActivityHelper(preloadedData.messages, true);
      preloadOptions.reactionIndex = getActivityHelper(preloadedData.reactions, true);
    }

    commentRef.current.start(preloadOptions);

    return () => {
      if (commentRef.current) {
        commentRef.current.stop();
        commentRef.current = null;
      }
    };
  }, [user.privateKey, user.nickname, infra.topic, infra.beeUrl, infra.stamp, infra.pollInterval]);

  const sendMessage = useCallback((message: string) => {
    return commentRef.current ? commentRef.current.sendMessage(message, MessageType.TEXT) : Promise.resolve();
  }, []);

  const sendReaction = useCallback(
    (targetMessageId: string, emoji: string) => {
      return commentRef.current
        ? commentRef.current.sendMessage(emoji, MessageType.REACTION, targetMessageId, undefined, reactionMessages)
        : Promise.resolve();
    },
    [reactionMessages]
  );

  const sendReply = useCallback((parentMessageId: string, message: string) => {
    return commentRef.current ? commentRef.current.sendMessage(message, MessageType.THREAD, parentMessageId) : Promise.resolve();
  }, []);

  const hasPreviousMessages = useCallback(() => {
    return commentRef.current ? commentRef.current.hasPreviousMessages() : false;
  }, []);

  const fetchPreviousMessages = useCallback(() => {
    return commentRef.current ? commentRef.current.fetchPreviousMessages() : Promise.resolve();
  }, []);

  const retrySendMessage = useCallback((message: VisibleMessage) => {
    if (message.requested && message.error && commentRef.current) {
      commentRef.current.retrySendMessage(message);
    }
  }, []);

  return {
    commentLoading,
    messagesLoading,
    allMessages: messages,
    simpleMessages,
    threadMessages,
    reactionMessages,
    groupedReactions,
    error,
    getThreadMessages,
    sendMessage,
    sendReaction,
    sendReply,
    hasPreviousMessages,
    fetchPreviousMessages,
    retrySendMessage,
  };
};
