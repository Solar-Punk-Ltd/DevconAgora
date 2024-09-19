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
    <div className="chat">
      <p className="chat__p">
        The Chat
      </p>
      
      <NavigationFooter />
    </div>
  );
}

export default Chat;