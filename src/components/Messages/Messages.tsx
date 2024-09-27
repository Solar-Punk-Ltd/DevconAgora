import React from 'react';
import "./Messages.scss";
import Message from './Message/Message';
import { MessageWithThread, ThreadId } from '../../types/message';
import { EthAddress, SwarmChat } from 'solarpunk-swarm-decentralized-chat';
import { BatchId } from '@ethersphere/bee-js';

interface MessagesProps {
    messages: MessageWithThread[];
    nickname: string;
    ownAddress: EthAddress;
    chat: SwarmChat;
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
  if (messages.length === 0) {
    return (
      <div className="messages messages__no-messages">
        <p>{"There’s nothing in this chat yet."}</p>
        <p>{"Start the conversation!"}</p>
      </div>
    );
  }

  return (
    <div className="messages">
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