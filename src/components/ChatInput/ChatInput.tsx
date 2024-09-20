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
  const [reconnecting, setReconnecting] = useState(false);
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {

    if (!chat.isRegistered(ownAddress)) {
      setReconnecting(true);
      await chat.registerUser(topic, { participant: ownAddress, key: privKey, stamp, nickName: nickname })
        .then(() => console.info(`user reconnected.`))
        .catch((err) => console.error(`error when reconnecting ${err.error}`));
      setReconnecting(false);   // this might not be accurate
    }

    const messageObj: MessageData = {
      message: messageToSend,
      timestamp: Date.now(),
      username: nickname,
      address: ownAddress
    }

    setSending(true);
    await chat.sendMessage(
      ownAddress,
      topic,
      messageObj,
      stamp,
      privKey
    );
    setSending(false);
    setMessageToSend("");
  }

  return (
    <div id="chat-input">
      {(reconnecting || sending) ? (
        reconnecting ? (
          <p>Reconnecting...</p>
        ) : (
          sending && <p>Sending message...</p>
        )
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
        disabled={(reconnecting || sending)}
      >
        Send
      </button>
    </div>
  )
}

export default ChatInput;