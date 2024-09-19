import React from 'react';
import "./Chat.scss"
import NavigationFooter from '../../components/NavigationFooter/NavigationFooter';

interface ChatProps {
  something?: boolean;
}


const Chat: React.FC<ChatProps> = (
    something,
) => {
  return (
    <div className="chat-page">
      {/**AgendaItem */}

      {/**Messages */}
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


        {/**ChatInput */}

      <p className="chat-page__p">
        The Chat
      </p>
      
      <NavigationFooter />
    </div>
  );
}

export default Chat;