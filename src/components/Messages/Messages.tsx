import React from 'react';
import "./Messages.scss";
import Message from './Message/Message';

interface MessagesProps {
    messages: object[];
}


const Messages: React.FC<MessagesProps> = ({
  messages
}) => {
  return (
    <div className="messages">
      <Message 
        text={"Hello world"}
        timestamp={123}
        threadId={"0x123"}
      />

      <Message 
        text={"Szia"}
        timestamp={233}
        threadId={"0x129"}
      />

      <Message 
        text={"Sziasztok"}
        timestamp={445}
        threadId={"0x456"}
      />

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