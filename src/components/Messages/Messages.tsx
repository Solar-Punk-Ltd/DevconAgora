import React from 'react';
import "./Messages.scss";
import Message from './Message/Message';
import { MessageData } from 'solarpunk-swarm-decentralized-chat';

interface MessagesProps {
    messages: MessageData[];
}


const Messages: React.FC<MessagesProps> = ({
  messages
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
      {messages.map((message, ind) => (
        <Message 
          data={message}
          threadId={`mock-${ind}`}
        />
      ))}
    </div>
  );
}

export default Messages;