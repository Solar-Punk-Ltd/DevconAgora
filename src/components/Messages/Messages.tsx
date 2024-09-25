import React from 'react';
import "./Messages.scss";
import Message from './Message/Message';
import { MessageWithThread, ThreadId } from '../../types/message';

interface MessagesProps {
    messages: MessageWithThread[];
    currentThread: ThreadId | null;
    setThreadId: React.Dispatch<React.SetStateAction<string | null>>;
}


const Messages: React.FC<MessagesProps> = ({
  messages,
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
          currentThread={currentThread}
          threadId={msg.threadId}
          parent={msg.parent}
          setThreadId={setThreadId}
          key={`${msg.threadId}-${msg.parent}`}
        />
      ))}
    </div>
  );
}

export default Messages;