import React, { useEffect, useState } from 'react';
import "./Chat.scss"
import { EthAddress, EVENTS, MessageData, SwarmChat } from 'solarpunk-swarm-decentralized-chat';
import NavigationFooter from '../../components/NavigationFooter/NavigationFooter';
import AgendaItem from '../../components/AgendaItem/AgendaItem';
import Back from '../../components/Back/Back';
import Messages from '../../components/Messages/Messages';
import ChatInput from '../../components/ChatInput/ChatInput';
import { Wallet } from 'ethers';
import { BatchId } from '@ethersphere/bee-js';
import { Session } from '../../types/session';
import { MessageWithThread, ThreadId } from '../../types/message';

interface ChatProps {
  topic: string;
  privKey: string;
  stamp: BatchId;
  nickname: string;
  gsocResourceId: string;
  session?: Session;
  topMenuColor?: string;
}

const GATEWAY = "86d2154575a43f3bf9922d9c52f0a63daca1cf352d57ef2b5027e38bc8d8f272";
const MOCK_HEARTED = true;

const Chat: React.FC<ChatProps> = ({
    topic,
    privKey,
    stamp,
    nickname,
    gsocResourceId,
    session,
    topMenuColor
}) => {
  const [chat, setChat] = useState<SwarmChat|null>(null);
  const [messages, setMessages] = useState<MessageWithThread[]>([]);
  const [currentThread, setCurrentThread] = useState<null|ThreadId>(null);
  const wallet = new Wallet(privKey);
  const ownAddress = wallet.address as EthAddress;


  const init = async () => { console.log("chat: ", chat)
    // Initialize the SwarmDecentralizedChat library
    const newChat = new SwarmChat({
      url: process.env.BEE_API_URL,
      gateway: GATEWAY,
      gsocResourceId,
      logLevel: "info", 
      usersFeedTimeout: 10000,
      messageCheckInterval: 2000,
      messageFetchMin: 2000,
      //  prettier: undefined
    });
    //setChat(newChat)

    // Start polling messages & the Users feed
    newChat.startMessageFetchProcess(topic);
    newChat.startUserFetchProcess(topic);

    // Connect to chat
    await newChat.registerUser(topic, { participant: ownAddress, key: privKey, stamp, nickName: nickname })
      .then(() => console.info(`user registered.`))
      .catch((err) => console.error(`registerUser error ${err.error}`));

    // Load users (first time when entering app)
    await newChat.initUsers(topic)
      .then(() => console.info(`initUsers was successful`))
      .catch((err) => console.error(`initUsers error: ${err.error}`));

      const { on } = newChat.getChatActions();
      on(EVENTS.RECEIVE_MESSAGE, (data) => handleReceiveMessage(data));

      setChat(() => {return newChat})
  }

  const handleReceiveMessage = (data: MessageData[]) => {
    const threadCapableMessages: MessageWithThread[] = data.map((msg) => {
      return {
        username: msg.username,
        address: msg.address,
        timestamp: msg.timestamp,
        message: JSON.parse(msg.message).text,
        threadId: JSON.parse(msg.message).threadId,
        parent: JSON.parse(msg.message).parent
      }
    });

    let finalMessages = []
    if (currentThread) {
      finalMessages = threadCapableMessages.filter((msg) => msg.parent === currentThread);
    } else {
      finalMessages = threadCapableMessages.filter((msg) => msg.parent === null);
    }

    
    setMessages(finalMessages);
  }

  useEffect(() => {
    init();

    return () => {
      chat?.stopMessageFetchProcess();
      chat?.stopUserFetchProcess();
    }
  }, []);


  return (
    <div className="chat-page">
      <Back 
        where={"Home"}
        link={"/home"}
        backgroundColor={topMenuColor}
      />

      {session && (
        <AgendaItem 
          title={session.title}
          startDate={session.slot_start}
          endDate={session.slot_end}
          hearted={MOCK_HEARTED}
          category={session.track}
          backgroundColor={topMenuColor}
          borderRadius={"0"}
          paddingRight={"16px"}
        />
      )}

      <Messages 
        messages={messages}
        currentThread={currentThread}
      />
        
      {chat && (
        <ChatInput 
        chat={chat}
        ownAddress={ownAddress}
        nickname={nickname}
        topic={topic}
        stamp={stamp}
        privKey={privKey}
        currentThread={currentThread}
      />
      )}
      
      <NavigationFooter />
    </div>
  );
}

export default Chat;