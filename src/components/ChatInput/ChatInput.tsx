import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BatchId } from "@ethersphere/bee-js";
import {
  EthAddress,
  MessageData,
  SwarmChat,
} from "@solarpunkltd/swarm-decentralized-chat";

import { MessageWithThread, ThreadId } from "../../types/message";
import { handleKeyDown, randomThreadId } from "../../utils/helpers";
import SendIcon from "../icons/SendIcon/SendIcon";

import InputLoading from "./InputLoading/InputLoading";

import "./ChatInput.scss";

interface ChatInputProps {
  chat: SwarmChat | null;
  ownAddress: EthAddress;
  nickname: string;
  topic: string;
  stamp: BatchId;
  privKey: string;
  currentThread: ThreadId | null;
  setBeingSentMessages: Dispatch<SetStateAction<MessageWithThread[]>>;
}

const ChatInput: React.FC<ChatInputProps> = ({
  chat,
  ownAddress,
  nickname,
  topic,
  stamp,
  privKey,
  currentThread,
  setBeingSentMessages,
}) => {
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [reconnecting, setReconnecting] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);

  if (!chat) return <></>;

  const sendMessage = async () => {
    if (!messageToSend) return;

    const messageId = randomThreadId();
    const threadId = randomThreadId();

    const messageObj: MessageData = {
      message: JSON.stringify({
        text: messageToSend,
        threadId: currentThread ? null : threadId, // Only 1 level of thread is allowed, so if this is already a thread, you can't start a thread from here
        messageId, // Every message has an ID, for liking
        parent: currentThread, // This will be ThreadId (string) or null
      }),
      timestamp: Date.now(),
      username: nickname,
      address: ownAddress,
    };

    setBeingSentMessages((prevMessages) => {
      const newMessages = [
        ...prevMessages,
        {
          username: nickname,
          address: ownAddress,
          timestamp: messageObj.timestamp,
          message: messageToSend,
          threadId: threadId,
          beingSent: true,
          messageId,
          parent: currentThread,
          replyCount: 0,
          likeTable: {},
        },
      ];

      return newMessages;
    });

    if (!chat.isRegistered(ownAddress)) {
      setReconnecting(true);
      let rounds = 0;
      const EVERY_X_ROUND = 5; // Resend registration request every X round
      const MAX_ROUNDS = 60;

      do {
        if (!(rounds % EVERY_X_ROUND))
          await chat
            .registerUser(topic, {
              participant: ownAddress,
              key: privKey,
              stamp,
              nickName: nickname,
            })
            .then(() => console.info(`Registration request sent`))
            .catch((err) =>
              console.error(`Error while registering ${err.error}`)
            );

        await chat.getNewUsers(topic);
        //await chat.initUsers(topic); // we might need this if reset queue does not work.
        rounds++;
      } while (rounds < MAX_ROUNDS && !chat.isRegistered(ownAddress));

      if (rounds === MAX_ROUNDS) {
        console.error("Registration did not go through");
        setSending(false);
        setReconnecting(false);
        setBeingSentMessages([]);
        return;
      }

      setReconnecting(false); // this might not be accurate
    }

    setSending(true);
    await chat.sendMessage(ownAddress, topic, messageObj, stamp, privKey);
    setMessageToSend("");
    setSending(false);
  };

  useEffect(() => {
    return () => {
      chat.stopMessageFetchProcess();
      chat.stopUserFetchProcess();
    };
  }, []);

  return (
    <div className="chat-input__wrapper">
      {reconnecting || sending ? (
        reconnecting ? (
          <div className="chat-input__connecting">
            {"Connecting to chat..."}
            <InputLoading />
          </div>
        ) : (
          sending && (
            <div className="chat-input__sending">
              <InputLoading />
            </div>
          )
        )
      ) : (
        <>
          <div className="chat-input">
            <input
              value={messageToSend}
              onChange={(e) => setMessageToSend(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "Enter", sendMessage)}
              className="chat-input__input"
            />
            <button
              onClick={sendMessage}
              className="chat-input__send-button"
              disabled={reconnecting || sending}
            >
              {messageToSend !== "" ? (
                <SendIcon />
              ) : (
                <SendIcon color="var(--grey-secondary)" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInput;
