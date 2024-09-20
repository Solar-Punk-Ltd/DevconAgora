import React, { useState } from 'react';
import "./ChatInput.scss";
import { EthAddress, MessageData, SwarmChat } from 'swarm-decentralized-chat';
import { BatchId } from '@ethersphere/bee-js';

interface ChatInputProps {
    chat: SwarmChat;
    ownAddress: EthAddress;
    nickname: string;
    topic: string;
    stamp: BatchId;
    privKey: string;
}


const ChatInput: React.FC<ChatInputProps> = ({
  chat,
  ownAddress,
  nickname,
  topic,
  stamp,
  privKey
}) => {
  const [messageToSend, setMessageToSend] = useState("");

  const sendMessage = async () => {
    const messageObj: MessageData = {
      message: messageToSend,
      timestamp: Date.now(),
      username: nickname,
      address: ownAddress
    }

    chat.sendMessage(
      ownAddress,
      topic,
      messageObj,
      stamp,
      privKey
    );
  }

  return (
    <div id="chat-input">
      <input 
        placeholder={"Type your message here..."}
        value={messageToSend}
        onChange={(e) => setMessageToSend(e.target.value)}
      />

      <button 
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  )
}

export default ChatInput;