import React from 'react';
import "./Message.scss";

interface MessageProps {
    text: string;
    timestamp: number;
    threadId: string;
}

const Message: React.FC<MessageProps> = ({
    text,
    timestamp,
    threadId,
}) => {
  return (
    <div className="message">
        <p>{text}</p>
        <p>{timestamp}</p>
    </div>
  )
}

export default Message;