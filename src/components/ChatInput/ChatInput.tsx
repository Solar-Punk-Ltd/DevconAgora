import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./ChatInput.scss";
import {
  EthAddress,
  MessageData,
  SwarmChat,
} from "@solarpunkltd/swarm-decentralized-chat";
import { BatchId } from "@ethersphere/bee-js";
import SendIcon from "../icons/SendIcon/SendIcon";
import { MessageWithThread, ThreadId } from "../../types/message";
import { randomThreadId, handleKeyDown } from "../../utils/helpers";
import InputLoading from "./InputLoading/InputLoading";
import { BEING_SENT } from "../../utils/constants";

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
  setBeingSentMessages
}) => {
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [reconnecting, setReconnecting] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);

  if (!chat) return <></>;

  const sendMessage = async () => {
    if (!messageToSend) return;

    const messageId = randomThreadId();

    const messageObj: MessageData = {
      message: JSON.stringify({
        text: messageToSend,
        threadId: currentThread ? null : randomThreadId(), // Only 1 level of thread is allowed, so if this is already a thread, you can't start a thread from here
        messageId,                                         // Every message has an ID, for liking
        parent: currentThread,                             // This will be ThreadId (string) or null
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
          threadId: BEING_SENT,
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
      const EVERY_X_ROUND = 5;    // Resend registration request every X round
      const MAX_ROUNDS = 60;

      do {
        if (!(rounds % EVERY_X_ROUND)) await chat
          .registerUser(topic, {
            participant: ownAddress,
            key: privKey,
            stamp,
            nickName: nickname,
          })
          .then(() => console.info(`Registration request sent`))
          .catch((err) => console.error(`Error while registering ${err.error}`));

        await chat.getNewUsers(topic);
        rounds++;
      } while (!chat.isRegistered(ownAddress) && rounds < MAX_ROUNDS);

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
    }
  }, []);


  return (
    <div
      id="chat-input"
      className={sending || reconnecting ? "chat-input__processing" : ""}
    >
      {reconnecting || sending ? (
        reconnecting ? (
          <div className="chat-input__connecting">
            <InputLoading />
            {"Connecting to chat..."}
          </div>
        ) : (
          sending && <InputLoading />
        )
      ) : (
        <>
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
            <SendIcon />
          </button>
        </>
      )}
    </div>
  );
};

export default ChatInput;
