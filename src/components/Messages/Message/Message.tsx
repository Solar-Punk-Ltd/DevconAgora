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
        <p><strong>{`${data.username}: `}</strong>{data.message}</p>
        <p>{data.timestamp}</p>
    </div>
  )
}

export default Message;