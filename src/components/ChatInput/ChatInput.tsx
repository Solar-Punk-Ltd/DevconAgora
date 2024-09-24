import React, { useState } from 'react';
import "./ChatInput.scss";
import { EthAddress, MessageData, SwarmChat } from 'solarpunk-swarm-decentralized-chat';
import { BatchId } from '@ethersphere/bee-js';
import SendIcon from '../icons/SendIcon/SendIcon';

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  const sendMessage = async () => {
    if (!messageToSend) return;

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
    setMessageToSend("");
    setSending(false);
  }

  return (
    <div id="chat-input" className={(sending || reconnecting ? "chat-input__processing" : "")}>
      {(reconnecting || sending) ? (
        reconnecting ? (
          <div>{"Connecting to chat..."}</div>
        ) : (
          sending && <>{"Sending message..."}</>
        )
      ) 
        : 
      (
        <>
          <input 
            value={messageToSend}
            onChange={(e) => setMessageToSend(e.target.value)}
            onKeyDown={handleKeyDown}
            className="chat-input__input"
          />
          <button 
            onClick={sendMessage}
            className="chat-input__send-button"
            disabled={(reconnecting || sending)}
          >
            <SendIcon />
          </button>
        </>
      )
    }

    </div>
  )
}

export default ChatInput;