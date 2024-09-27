import React, { useEffect, useRef, useState } from 'react';
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
import { ROUTES } from '../../utils/constants';

interface ChatProps {
  topic: string;
  privKey: string;
  stamp: BatchId;
  nickname: string;
  gsocResourceId: string;
  session?: Session;
  topMenuColor?: string;
  originatorPage: string;
  originatorPageUrl: string;
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
    topMenuColor,
    originatorPage,
    originatorPageUrl
}) => {
  const [chat, setChat] = useState<SwarmChat|null>(null);
  const [allMessages, setAllMessages] = useState<MessageData[]>([]);
  const [visibleMessages, setVisibleMessages] = useState<MessageWithThread[]>([]);
  const [currentThread, setCurrentThread] = useState<ThreadId|null>(null);
  const currentThreadRef = useRef(currentThread);
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
    const finalMessages = filterMessages(data);

    setAllMessages([...data]);
    setVisibleMessages([...finalMessages]);
  }

  const filterMessages = (data: MessageData[]): MessageWithThread[] => {    
    let threadCapableMessages: MessageWithThread[] = [];

    for (let i = 0; i < data.length; i++) {
      const msgObj = JSON.parse(data[i].message);

      if (msgObj.like) {
        const likedIndex = threadCapableMessages.findIndex((msg) => msg.messageId === msgObj.like);
        threadCapableMessages[likedIndex].likeCount++;
      } else {
        threadCapableMessages.push({
          username: data[i].username,
          address: data[i].address,
          timestamp: data[i].timestamp,
          message: msgObj.text,
          threadId: msgObj.threadId,
          messageId: msgObj.messageId,
          parent: msgObj.parent,
          replyCount: 0,
          likeCount: 0
        });

        if (msgObj.parent) {
          const parentIndex = threadCapableMessages.findIndex((msg) => msg.threadId === msgObj.parent);
          threadCapableMessages[parentIndex].replyCount++;
        }
      }
    }

    let filteredMessages = []
    if (currentThreadRef.current) {
      filteredMessages = threadCapableMessages.filter((msg) => msg.parent === currentThreadRef.current || msg.threadId === currentThreadRef.current);
    } else {
      filteredMessages = threadCapableMessages.filter((msg) => msg.parent === null);
    }
    
    return filteredMessages;
  }

  useEffect(() => {
    init();

    return () => {
      chat?.stopMessageFetchProcess();
      chat?.stopUserFetchProcess();
    }
  }, []);

  useEffect(() => {
    setVisibleMessages([]);
    currentThreadRef.current = currentThread;
    const newlyFilteredMessages = filterMessages(allMessages);

    setVisibleMessages([...newlyFilteredMessages]);
  }, [currentThread]);


  return (
    <div className="chat-page">
      <Back 
        where={currentThread ? "Back to main thread" : originatorPage}
        link={currentThread ? ROUTES.HOME : originatorPageUrl}
        backgroundColor={topMenuColor}
        action={currentThread ? () => setCurrentThread(null) : undefined}
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

      {chat && (
        <>
          <Messages 
            messages={visibleMessages}
            nickname={nickname}
            ownAddress={ownAddress}
            chat={chat}
            topic={topic}
            stamp={stamp}
            privKey={privKey}
            currentThread={currentThread}
            setThreadId={setCurrentThread}
            key={`${currentThread}-${allMessages.length}`}
          />
                
          <ChatInput 
            chat={chat}
            ownAddress={ownAddress}
            nickname={nickname}
            topic={topic}
            stamp={stamp}
            privKey={privKey}
            currentThread={currentThread}
          />
        </>
      )}
      
      <NavigationFooter />
    </div>
  );
}

export default Chat;