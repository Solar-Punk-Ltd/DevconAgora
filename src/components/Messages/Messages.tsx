import React, { useRef } from 'react';
import "./Messages.scss";
import Message from './Message/Message';
import { MessageWithThread, ThreadId } from '../../types/message';
import { EthAddress, SwarmChat } from 'solarpunk-swarm-decentralized-chat';
import { BatchId } from '@ethersphere/bee-js';

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
  setThreadId
}) => {
  const chatBodyRef = useRef<HTMLDivElement>(null);

  if (messages.length === 0 || !chat) {
    return (
      <div className="messages messages__no-messages">
        <p>{"There’s nothing in this chat yet."}</p>
        <p>{"Start the conversation!"}</p>
      </div>
    );
  }

  const isScrolledToBottom = () => {
    if (chatBodyRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;
      const threshold = clientHeight * 2;
      return Math.abs(scrollHeight - clientHeight - scrollTop) < threshold;
    }
    return false;
  };

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };
  
  // Schedule a scroll after the state update if we're already at the bottom
  if (isScrolledToBottom()) {
    setTimeout(scrollToBottom, 0);
  }

  
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
}

export default Messages;