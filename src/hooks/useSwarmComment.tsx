import { MessageData, MessageType } from "@solarpunkltd/comment-system"; // TODO: maybe export messageData from swarm-comment-js
import { CommentSettings, EVENTS, SwarmComment } from "@solarpunkltd/swarm-comment-js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useGlobalState } from "@/contexts/global";
import { getTopic } from "@/utils/bee";
import { CATEGORIES, MAX_PRELOADED_TALKS } from "@/utils/constants";

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
// TODO: handle legacy object transformation to new messageData
export const useSwarmComment = ({ user, infra }: CommentSettings, startFetch?: boolean) => {
  const commentRef = useRef<SwarmComment | null>(null);
  const { loadedTalks, setLoadedTalks, talkActivity, setTalkActivity, spacesActivity, setSpacesActivity } = useGlobalState();

  // todo: does sessionId need to be a state ?
  const sessionId = infra.topic;
  const talkId = getTopic(sessionId);

  // const preloadedMessages = useMemo(() => {
  //   if (loadedTalks) {
  //     const talk = loadedTalks.find((t) => t.talkId === talkId);
  //     return talk?.messages ?? [];
  //   }
  //   return undefined;
  // }, [loadedTalks, talkId]);
  // const isPreloaded = useMemo(() => preloadedMessages !== undefined, [preloadedMessages]);

  // const [messages, setMessages] = useState<VisibleMessage[]>(preloadedMessages || []);
  const [messages, setMessages] = useState<VisibleMessage[]>([]);
  const [commentLoading, setCommentLoading] = useState<boolean>(true);
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

  const updateTalkActivity = useCallback(() => {
    if (loadedTalks) {
      let tmpActivity: Map<string, bigint>;
      const isSpacesTalk = CATEGORIES.find((c: string) => c === sessionId);
      if (!isSpacesTalk) {
        tmpActivity = new Map(talkActivity);
      } else {
        tmpActivity = new Map(spacesActivity);
      }
      const foundIx = loadedTalks.findIndex((talk: any) => talk.talkId === talkId);
      if (foundIx > -1) {
        tmpActivity.set(sessionId, BigInt(loadedTalks[foundIx].messages.length));
      }

      if (!isSpacesTalk) {
        setTalkActivity(tmpActivity);
      } else {
        setSpacesActivity(tmpActivity);
      }
    }
  }, [loadedTalks, sessionId, talkActivity, spacesActivity, setTalkActivity, setSpacesActivity]);

  const updateLoadedTalks = useCallback(
    (messages: VisibleMessage[]) => {
      const prevLoadedTalks = [...(loadedTalks || [])];
      const newTalk = {
        talkId: sessionId,
        messages,
      };
      if (!loadedTalks || loadedTalks.length < MAX_PRELOADED_TALKS) {
        prevLoadedTalks.push(newTalk);
      } else {
        prevLoadedTalks.splice(0, 1, newTalk);
      }

      setLoadedTalks(prevLoadedTalks);
    },
    [loadedTalks, sessionId, setLoadedTalks]
  );

  const onMessageReceived = useCallback(
    (currentMessages: VisibleMessage[]) => {
      updateTalkActivity();
      updateLoadedTalks(currentMessages);
    },
    [updateTalkActivity, updateLoadedTalks]
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
    if (commentRef.current) return;

    commentRef.current = new SwarmComment({ user, infra });

    const { on } = commentRef.current.getEmitter();

    // Move createMessageHandler inside useEffect to avoid dependency issues
    const createMessageHandler = (updates: Partial<VisibleMessage>) => {
      return (d: MessageData | string) => {
        const data = typeof d === "string" ? JSON.parse(d) : d;
        const newMessage = { ...data, ...updates } as VisibleMessage;
        addMessage(newMessage);
        // Use setTimeout to ensure state updates are reflected
        // if (updates.received) {
        //   setTimeout(() => {
        //     setMessages((currentMessages) => {
        //       onMessageReceived(currentMessages);
        //       return currentMessages;
        //     });
        //   }, 0);
        // }
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
      setCommentLoading(loading);
    });
    on(EVENTS.LOADING_PREVIOUS_MESSAGES, (loading: boolean) => setMessagesLoading(loading));
    on(EVENTS.CRITICAL_ERROR, (err: any) => setError(err));

    commentRef.current.start();

    return () => {
      if (commentRef.current) {
        commentRef.current.stop();
        commentRef.current = null;
      }
    };
    // }, [user.privateKey, infra.topic, addMessage, onMessageReceived]); // Stable dependencies only
  }, [user.privateKey, infra.topic, addMessage]); // Stable dependencies only

  const sendMessage = useCallback((message: string) => {
    return commentRef.current?.sendMessage(message, MessageType.TEXT);
  }, []);

  const sendReaction = useCallback(
    (targetMessageId: string, emoji: string) => {
      return commentRef.current?.sendMessage(emoji, MessageType.REACTION, targetMessageId, undefined, reactionMessages);
    },
    [reactionMessages]
  );

  const sendReply = useCallback((parentMessageId: string, message: string) => {
    return commentRef.current?.sendMessage(message, MessageType.THREAD, parentMessageId);
  }, []);

  const hasPreviousMessages = useCallback(() => {
    return commentRef.current?.hasPreviousMessages();
  }, []);

  const fetchPreviousMessages = useCallback(() => {
    return commentRef.current?.fetchPreviousMessages();
  }, []);

  const retrySendMessage = useCallback((message: VisibleMessage) => {
    if (message.requested && message.error) {
      commentRef.current?.retrySendMessage(message);
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
