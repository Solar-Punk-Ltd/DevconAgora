import React from 'react';
import "./Message.scss";
import { MessageData } from 'swarm-decentralized-chat';

interface MessageProps {
    data: MessageData;
    threadId: string;
}

const Message: React.FC<MessageProps> = ({
    data,
    threadId,
}) => {
  return (
    <div className="message">
      <div className="message__left-side">
        A
      </div>
      <div className="message__right-side">
        <p className="message__right-side__username">{data.username}</p>
        <p>{data.message}</p>
        <p>{"like-reply"}</p>
      </div>
    </div>
  )
}

export default Message;