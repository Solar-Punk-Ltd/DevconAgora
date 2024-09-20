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
  const [isReconnecting, setIsReconnecting] = useState(false);

  const sendMessage = async () => {

    if (!chat.isRegistered(ownAddress)) {
      setIsReconnecting(true);
      await chat.registerUser(topic, { participant: ownAddress, key: privKey, stamp, nickName: nickname })
        .then(() => console.info(`user reconnected.`))
        .catch((err) => console.error(`error when reconnecting ${err.error}`));
      setIsReconnecting(false);   // this might not be accurate
    }

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
      {isReconnecting ? (
        <p>Reconnecting...</p>
      ) 
        : 
      (
        <input 
          placeholder={"Type your message here..."}
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.target.value)}
        />
      )
    }

      <button 
        onClick={sendMessage}
        disabled={isReconnecting}
      >
        Send
      </button>
    </div>
  )
}

export default ChatInput;