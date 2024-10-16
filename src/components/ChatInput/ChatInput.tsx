import React, { Dispatch, SetStateAction, useState } from "react";
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

interface ChatInputProps {
  chat: SwarmChat | null;
  ownAddress: EthAddress;
  nickname: string;
  topic: string;
  stamp: BatchId;
  privKey: string;
  currentThread: ThreadId | null;
  setVisibleMessages: Dispatch<SetStateAction<MessageWithThread[]>>;
}

const ChatInput: React.FC<ChatInputProps> = ({
  chat,
  ownAddress,
  nickname,
  topic,
  stamp,
  privKey,
  currentThread,
  setVisibleMessages,
}) => {
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [reconnecting, setReconnecting] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);

  if (!chat) return <></>;

  const sendMessage = async () => {
    if (!messageToSend) return;

    const messageObj: MessageData = {
      message: JSON.stringify({
        text: messageToSend,
        threadId: currentThread ? null : randomThreadId(), // Only 1 level of thread is allowed, so if this is already a thread, you can't start a thread from here
        messageId: randomThreadId(), // Every message has an ID, for liking
        parent: currentThread, // This will be ThreadId (string) or null
      }),
      timestamp: Date.now(),
      username: nickname,
      address: ownAddress,
    };

    setVisibleMessages((prevMessages) => {
      const newMessages = [
        ...prevMessages,
        {
          username: nickname,
          address: ownAddress,
          timestamp: messageObj.timestamp,
          message: messageToSend,
          threadId: "being-sent",
          messageId: "being-sent",
          parent: currentThread,
          replyCount: 0,
          likeTable: {},
        },
      ];

      return newMessages;
    });

    console.log("USERS! ", chat.getDiagnostics().users);
    if (!chat.isRegistered(ownAddress)) {
      console.log("Diagnostics: ", chat.getDiagnostics());
      setReconnecting(true);
      let rounds = 0;
      const waitOneRound = async (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };

      await chat
        .registerUser(topic, {
          participant: ownAddress,
          key: privKey,
          stamp,
          nickName: nickname,
        })
        .then(() => console.info(`user reconnected.`))
        .catch((err) => console.error(`error when reconnecting ${err.error}`));

      do {
        await waitOneRound(1000);
        console.log("isRegistered: ", chat.isRegistered(ownAddress));
      } while (!chat.isRegistered(ownAddress) && rounds < 60);

      setReconnecting(false); // this might not be accurate
    }

    setSending(true);
    await chat.sendMessage(ownAddress, topic, messageObj, stamp, privKey);
    setMessageToSend("");
    setSending(false);
  };

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
