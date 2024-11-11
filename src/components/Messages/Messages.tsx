import React, { useEffect, useRef, useState } from 'react';
import { BatchId } from '@ethersphere/bee-js';
import { EthAddress, SwarmChat } from '@solarpunkltd/swarm-decentralized-chat';

import { MessageWithThread, ThreadId } from '../../types/message';

import Message from './Message/Message';

import './Messages.scss';

interface MessagesProps {
  messages: MessageWithThread[];
  nickname: string;
  ownAddress: EthAddress;
  chat: SwarmChat | null;
  topic: string;
  stamp: BatchId;
  privKey: string;
  currentThread: ThreadId | null;
  setThreadId: React.Dispatch<React.SetStateAction<string | null>>;
}

const Messages: React.FC<MessagesProps> = ({
  messages,
  nickname,
  ownAddress,
  chat,
  topic,
  stamp,
  privKey,
  currentThread,
  setThreadId,
}) => {
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const [autoscroll, setAutoscroll] = useState(true);
  const handleScroll = () => {
    if (chatBodyRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;
      if (scrollTop + clientHeight < scrollHeight) {
        setAutoscroll(false);
      } else {
        setAutoscroll(true);
      }
    }
  };
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (chatBodyRef.current) {
        chatBodyRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  useEffect(() => {
    if (chatBodyRef.current && autoscroll) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0 || !chat) {
    return (
      <div className="messages messages__no-messages">
        <p>{'Start the conversation!'}</p>
      </div>
    );
  }

  // const isScrolledToBottom = () => {
  //   if (chatBodyRef.current) {
  //     const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;
  //     const threshold = clientHeight * 2;
  //     return Math.abs(scrollHeight - clientHeight - scrollTop) < threshold;
  //   }
  //   return false;
  // };

  // const scrollToBottom = () => {
  //   if (chatBodyRef.current) {
  //     chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  //   }
  // };

  // // Schedule a scroll after the state update if we're already at the bottom
  // if (true || isScrolledToBottom()) {
  //   setTimeout(scrollToBottom, 0);
  // }

  return (
    <div className="messages" ref={chatBodyRef}>
      {messages.map((msg, ind) => (
        <Message
          data={msg}
          nickname={nickname}
          ownAddress={ownAddress}
          chat={chat}
          topic={topic}
          stamp={stamp}
          privKey={privKey}
          currentThread={currentThread}
          threadId={msg.threadId}
          parent={msg.parent}
          setThreadId={setThreadId}
          key={ind}
        />
      ))}
    </div>
  );
};

export default Messages;
