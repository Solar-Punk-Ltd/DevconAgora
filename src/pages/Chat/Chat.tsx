import React, { useEffect, useRef, useState } from "react";
import "./Chat.scss";
import {
  EthAddress,
  EVENTS,
  MessageData,
  SwarmChat,
} from "@solarpunkltd/swarm-decentralized-chat";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import AgendaItem from "../../components/AgendaItem/AgendaItem";
import Back from "../../components/Back/Back";
import Messages from "../../components/Messages/Messages";
import ChatInput from "../../components/ChatInput/ChatInput";
import { Wallet } from "ethers";
import { BatchId } from "@ethersphere/bee-js";
import { Session } from "../../types/session";
import { MessageWithThread, ThreadId } from "../../types/message";
import { ROUTES } from "../../utils/constants";
import InputLoading from "../../components/ChatInput/InputLoading/InputLoading";

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
  backAction: () => any | undefined | null;
}

const Chat: React.FC<ChatProps> = ({
  topic,
  privKey,
  stamp,
  nickname,
  gsocResourceId,
  session,
  topMenuColor,
  originatorPage,
  originatorPageUrl,
  backAction,
}) => {
  const chat = useRef<SwarmChat | null>(null);
  const [allMessages, setAllMessages] = useState<MessageData[]>([]);
  const [visibleMessages, setVisibleMessages] = useState<MessageWithThread[]>(
    []
  );
  const [currentThread, setCurrentThread] = useState<ThreadId | null>(null);
  const [chatLoaded, setChatLoaded] = useState(false);
  const currentThreadRef = useRef(currentThread);
  const wallet = new Wallet(privKey);
  const ownAddress = wallet.address as EthAddress;
  const modal = true;

  const init = async () => {
    // Initialize the SwarmDecentralizedChat library
    const newChat = new SwarmChat({
      url: process.env.BEE_API_URL,
      gateway: process.env.GATEWAY,
      gsocResourceId,
      logLevel: "info",
      usersFeedTimeout: 10000,
      messageCheckInterval: 2000,
      messageFetchMin: 2000,
      //  prettier: undefined
    });

    // Start polling messages & the Users feed
    newChat.startMessageFetchProcess(topic);
    console.info("Message fetch process started.");
    newChat.startUserFetchProcess(topic);
    // probably move this more down

    // Connect to chat
    /*await newChat
      .registerUser(topic, {
        participant: ownAddress,
        key: privKey,
        stamp,
        nickName: nickname,
      })
      .then(() => console.info(`user registered.`))
      .catch((err) => console.error(`registerUser error ${err.error}`));*/

    // Load users (first time when entering app)
    await newChat
      .initUsers(topic)
      .then(() => console.info(`initUsers was successful`))
      .catch((err) => console.error(`initUsers error: ${err.error}`));

    const { on } = newChat.getChatActions();
    on(EVENTS.RECEIVE_MESSAGE, (data) => handleReceiveMessage(data));

    chat.current = newChat;
    setChatLoaded(true);
  };

  const handleReceiveMessage = (data: MessageData[]) => {
    const finalMessages = filterMessages(data);

    setAllMessages([...data]);
    setVisibleMessages([...finalMessages]);
  };

  const filterMessages = (data: MessageData[]): MessageWithThread[] => {
    const threadCapableMessages: MessageWithThread[] = [];

    for (let i = 0; i < data.length; i++) {
      const msgObj = JSON.parse(data[i].message);
      const address = data[i].address;

      if (msgObj.like) {
        const likedIndex = threadCapableMessages.findIndex(
          (msg) => msg.messageId === msgObj.like
        );
        threadCapableMessages[likedIndex].likeTable[address] = true;
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
          likeTable: {},
        });

        if (msgObj.parent) {
          const parentIndex = threadCapableMessages.findIndex(
            (msg) => msg.threadId === msgObj.parent
          );
          threadCapableMessages[parentIndex].replyCount++;
        }
      }
    }

    let filteredMessages = [];
    if (currentThreadRef.current) {
      filteredMessages = threadCapableMessages.filter(
        (msg) =>
          msg.parent === currentThreadRef.current ||
          msg.threadId === currentThreadRef.current
      );
    } else {
      filteredMessages = threadCapableMessages.filter(
        (msg) => msg.parent === null
      );
    }

    return filteredMessages;
  };

  useEffect(() => {
    if (!chat.current) init();

    return () => {
      console.info("Chat cleanup...", chat.current);
      chat.current?.stopMessageFetchProcess();
      chat.current?.stopUserFetchProcess();
      chat.current = null;
      console.info("Chat cleanup done.");
    };
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
        action={currentThread ? () => setCurrentThread(null) : backAction}
      />

      {session && (
        // TODO: what to do here with onClick ?
        <AgendaItem
          id={session.id}
          title={session.title}
          startDate={session.slot_start}
          endDate={session.slot_end}
          liked={session.liked}
          category={session.track}
          backgroundColor={topMenuColor}
          borderRadius={"0"}
          paddingRight={"16px"}
        />
      )}

      {chatLoaded ? (
        <>
          <Messages
            messages={visibleMessages}
            nickname={nickname}
            ownAddress={ownAddress}
            chat={chat.current}
            topic={topic}
            stamp={stamp}
            privKey={privKey}
            currentThread={currentThread}
            setThreadId={setCurrentThread}
            key={`${currentThread}-${allMessages.length}`}
          />

          <ChatInput
            chat={chat.current}
            ownAddress={ownAddress}
            nickname={nickname}
            topic={topic}
            stamp={stamp}
            privKey={privKey}
            currentThread={currentThread}
            setVisibleMessages={setVisibleMessages}
          />
        </>
      ) : (
        <div className="chat-page__loading">
          <div className="chat-page__loading__container">
            <InputLoading />
            <p>Loading chat...</p>
          </div>
        </div>
      )}

      {!modal && <NavigationFooter />}
    </div>
  );
};

export default Chat;
