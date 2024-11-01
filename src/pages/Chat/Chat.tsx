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
import { CATEGORY_NAMES_TO_ID_MAP, ROUTES } from "../../utils/constants";
import InputLoading from "../../components/ChatInput/InputLoading/InputLoading";
import FilteredMessages from "../../components/FilteredMessages/FilteredMessages";
import { useGlobalState } from "../../GlobalStateContext";
import { MINUTE } from "@solarpunkltd/swarm-decentralized-chat/constants.js";

interface ChatProps {
  title: string | undefined;
  topic: string | undefined;
  privKey: string;
  stamp: BatchId;
  nickname: string;
  gsocResourceId: string;
  gateway?: string
  session?: Session;
  topMenuColor?: string;
  originatorPage: string;
  originatorPageUrl: string;
  backAction: () => void | undefined | null;
}


const Chat: React.FC<ChatProps> = ({
  title,
  topic,
  privKey,
  stamp,
  nickname,
  gsocResourceId,
  gateway,
  session,
  topMenuColor,
  originatorPage,
  originatorPageUrl,
  backAction,
}) => {
  const chat = useRef<SwarmChat | null>(null);
  const {isContentFilterEnabled } = useGlobalState();
  const [allMessages, setAllMessages] = useState<MessageData[]>([]);
  const [beingSentMessages, setBeingSentMessages] = useState<MessageWithThread[]>([]);
  const [visibleMessages, setVisibleMessages] = useState<MessageWithThread[]>(
    []
  );
  const [currentThread, setCurrentThread] = useState<ThreadId | null>(null);
  const [chatLoaded, setChatLoaded] = useState<boolean>(false);
  const currentThreadRef = useRef(currentThread);
  const wallet = new Wallet(privKey);
  const ownAddress = wallet.address as EthAddress;
  const modal = true;
  // Now that we have 'title', we could calculate 'topic' here. Only problem is that it might be undefined.

  if (!topic) {
    return (
      <div className="chat-page-error">
        Topic is undefined
        <NavigationFooter />
      </div>
    );
  }

  const init = async () => {
    // Initialize the SwarmDecentralizedChat library
    const newChat = new SwarmChat({
      url: process.env.BEE_API_URL,
      gateway: gateway || process.env.GATEWAY,     // this shouldn't bee process.env.GATEWAY, each GSOC-node has it's own overlay address
      gsocResourceId,
      logLevel: "error",
      usersFeedTimeout: 5000,           // this might or might not help us, if we need to wait 10s to wait, that might add to the delay
      messageCheckInterval: 1600,       // We might want to reduce this number to 1000 or 800
      messageFetchMin: 1600,            // same as above
      //  prettier: undefined
    });

    // Load users (first time when entering app)
    await newChat
      .initUsers(topic)
      .then(() => console.info(`initUsers was successful`))
      .catch((err) => console.error(`initUsers error: ${err.error}`));

    const { on } = newChat.getChatActions();
    on(EVENTS.RECEIVE_MESSAGE, (data) => setAllMessages([...data]));

    chat.current = newChat;
    chat.current.startMessageFetchProcess(topic);
    console.info("Message fetch process started.");
    chat.current.startUserFetchProcess(topic);
    console.info("User fetch process started, interval: ", chat.current.getUserUpdateIntervalConst());
    setChatLoaded(true);
  };

  const resendStuckMessages = async () => {
    const beingSentThreshold = 1 * MINUTE;
    const now = Date.now();
    const messagesOlderThanThreshold = beingSentMessages.filter((msg) => msg.timestamp < now-beingSentThreshold);

    for (let i = 0; i < messagesOlderThanThreshold.length; i++) {
      console.info("Resending message...")
      const text = messagesOlderThanThreshold[i].message;
      console.log("This will be JSON.parsed: ", text)
      const newlyConstructedMessage: MessageData = {
        address: messagesOlderThanThreshold[i].address,
        username: messagesOlderThanThreshold[i].username,
        message: JSON.stringify({
          text: messagesOlderThanThreshold[i].message,
          threadId: null,   // we are using thread capability by this
          messageId: messagesOlderThanThreshold[i].messageId,
          parent: messagesOlderThanThreshold[i].parent
        }),
        timestamp: messagesOlderThanThreshold[i].timestamp
      }
      console.log("message obj: ", newlyConstructedMessage)
      const sResult = await chat.current?.sendMessage(ownAddress, topic, newlyConstructedMessage, stamp, privKey);
      console.log("sResult ", sResult)
    }
  }

  useEffect(() => {
    console.log("ALL MESSAGES: ", allMessages);
    resendStuckMessages();
    
    const messageIds = allMessages.map((msg) => {
      const msgWithDetails: any = msg.message;
      return msgWithDetails.messageId
    })
    const newBeingSent = beingSentMessages.filter((message) => !messageIds.includes(message.messageId));
    setBeingSentMessages(newBeingSent)
  }, [allMessages]);

  useEffect(() => {
    const finalMessages = filterMessages(allMessages);
    setVisibleMessages([...finalMessages, ...beingSentMessages]);
  }, [allMessages, beingSentMessages]);

  const filterMessages = (data: MessageData[]): MessageWithThread[] => {
    const threadCapableMessages: MessageWithThread[] = [];
    for (let i = 0; i < data.length; i++) {
      let msgObj;
      try {
        msgObj = data[i].message as any;
      } catch (error) {
        console.log(`error parsing message: ${data[i].message}:\n ${error}`);
        return [];
      }
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
          flagged: msgObj.flagged,
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
    setBeingSentMessages([]);
    currentThreadRef.current = currentThread;
    const newlyFilteredMessages = filterMessages(allMessages);

    setVisibleMessages([...newlyFilteredMessages]);
  }, [currentThread]);


  return (
    <div className="chat-page">
      <Back
        title={title}
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
          <FilteredMessages
            filterFunction={(message: MessageWithThread) => message.flagged !== true}
            filteringEnabled={isContentFilterEnabled}
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
            setBeingSentMessages={setBeingSentMessages}
            key={topic}
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
