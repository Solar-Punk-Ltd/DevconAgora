import React from 'react';
import "./Messages.scss";
import Message from './Message/Message';
import { MessageData } from 'swarm-decentralized-chat';

interface MessagesProps {
    messages: MessageData[];
}


const Messages: React.FC<MessagesProps> = ({
  messages
}) => {
  return (
    <div className="messages">
      {messages.map((message, ind) => (
        <Message 
          data={message}
          threadId={`mock-${ind}`}
        />
      ))}

              {/**Message threadId={"0x124"} */}
        {/**Message threadId={"0x125"} */}
        {/**Message threadId={"0x126"} */}
        {/**MessageThread threadId={"0x125"} */}
          {/**Message parent={"0x125"}*/}
          {/**Message parent={"0x125"}*/}
          {/**Message parent={"0x125"}*/}
        {/**Message threadId={"0x124"} */}
          {/**MessageControls */}
            {/**Like */}
            {/**Reply */}
        {/**OR */}
        {/**Message */}
          {/**Avatar */}
          {/**Name */}
          {/**Time */}
          {/**MessageBubble */}
          {/**MessageControls */}
            {/**Like */}
            {/**Reply */}
    </div>
  );
}

export default Messages;