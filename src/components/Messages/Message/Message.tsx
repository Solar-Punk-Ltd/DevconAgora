import React, { useState } from "react";
import clsx from "clsx";
import "./Message.scss";
import AvatarMonogram from "../../AvatarMonogram/AvatarMonogram";
import LikeIcon from "../../icons/LikeIcon/LikeIcon";
import { createMonogram, formatTime } from "../../../utils/helpers";
import { MessageWithThread, ThreadId } from "../../../types/message";
import {
  EthAddress,
  MessageData,
  SwarmChat,
} from "@solarpunkltd/swarm-decentralized-chat";
import { BatchId } from "@ethersphere/bee-js";
import LikeIconFilled from "../../icons/LikeIconFilled/LikeIconFilled";

interface MessageProps {
  data: MessageWithThread;
  nickname: string;
  ownAddress: EthAddress;
  chat: SwarmChat;
  topic: string;
  stamp: BatchId;
  privKey: string;
  currentThread: ThreadId | null;
  threadId: ThreadId | null;
  parent: ThreadId | null;
  setThreadId: React.Dispatch<React.SetStateAction<string | null>>;
}

const Message: React.FC<MessageProps> = ({
  data,
  nickname,
  ownAddress,
  chat,
  topic,
  stamp,
  privKey,
  currentThread,
  threadId,
  parent,
  setThreadId,
}) => {
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const actualUser = localStorage.getItem("username");

  const likeMessage = async () => {
    setLikeLoading(true);

    const messageObj: MessageData = {
      message: JSON.stringify({
        like: data.messageId,
      }),
      timestamp: Date.now(),
      username: nickname,
      address: ownAddress,
    };

    const rep = await chat.sendMessage(
      ownAddress,
      topic,
      messageObj,
      stamp,
      privKey
    );
    console.log("Like message ref: ", rep);
  };

  const likeCount = Object.values(data.likeTable).filter(
    (liked) => liked
  ).length; // Count truthy values
  const iLiked = data.likeTable[ownAddress];

  return (
    <div
      className={clsx("message", { own: actualUser === nickname })}
      style={{
        marginLeft: parent ? "32px" : undefined,
        opacity: data.beingSent ? 0.3 : 1,
      }}
    >
      <div className="message__left-side">
        <AvatarMonogram
          letters={createMonogram(data.username)}
          color={actualUser === nickname ? "#333333" : "#4A2875"}
          backgroundColor={actualUser === nickname ? "#4A287533" : "#F7F8FA"}
        />
      </div>

      <div className="message__right-side">
        <div
          className={clsx("message__right-side__name", {
            own: actualUser === nickname,
          })}
        >
          {data.username} &nbsp;
          <p className="message__right-side__name-and-time__time">
            {formatTime(data.timestamp)}
          </p>
        </div>

        <p
          className={clsx("message__right-side__text", {
            own: actualUser === nickname,
          })}
        >
          {data.message}
        </p>

        <div
          className={clsx("message__right-side__message-controls", {
            own: actualUser === nickname,
          })}
          onClick={() => null}
        >
          <div className="message__right-side__message-controls__number">
            <b>{likeCount ? likeCount : ""}</b>
          </div>
          <button
            className="message__right-side__message-controls_like"
            disabled={data.beingSent}
            onClick={likeMessage}
          >
            {likeLoading ? (
              <div className="message__right-side__message-controls_like_loading"></div>
            ) : iLiked ? (
              <LikeIconFilled color={"black"} />
            ) : (
              <LikeIcon fillColor={"#FFFF00"} />
            )}
          </button>

          {!currentThread && !data.beingSent && (
            <p
              className={
                data.replyCount
                  ? "message__right-side__message-controls_reply message__right-side__message-controls_reply__has-reply"
                  : "message__right-side__message-controls_reply"
              }
              onClick={() => setThreadId(threadId)}
            >
              {data.replyCount ? `${data.replyCount} Replies` : "Reply"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
