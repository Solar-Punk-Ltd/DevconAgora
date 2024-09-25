import React from 'react';
import "./Message.scss";
import AvatarMonogram from '../../AvatarMonogram/AvatarMonogram';
import LikeIcon from '../../icons/LikeIcon/LikeIcon';
import { createMonogram, formatTime } from '../../../utils/helpers';
import { MessageWithThread, ThreadId } from '../../../types/message';
import { EthAddress, MessageData, SwarmChat } from 'solarpunk-swarm-decentralized-chat';
import { BatchId } from '@ethersphere/bee-js';

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
    setThreadId
}) => {
  const likeMessage = async () => {
    const messageObj: MessageData = {
      message: JSON.stringify({
        like: data.messageId
      }),
      timestamp: Date.now(),
      username: nickname,
      address: ownAddress
    }

    const rep = await chat.sendMessage(
      ownAddress,
      topic,
      messageObj,
      stamp,
      privKey
    );
    console.log("Like message ref: ", rep)
  }


  return (
    <div className="message" style={{ marginLeft: parent ? "32px" : undefined}}>
     
      <div className="message__left-side">
        <AvatarMonogram letters={createMonogram(data.username)} />
      </div>

      <div className="message__right-side">
        <div className="message__right-side__name-and-time">
          <p className="message__right-side__name-and-time__username">{data.username}</p>
          {true && <p className="message__right-side__name-and-time__time">{formatTime(data.timestamp)}</p>}
        </div>
        
        <p className="message__right-side__text">{data.message}</p>
        
        <div className="message__right-side__message-controls" onClick={() => null}>
          <span>{data.likeCount ? data.likeCount : ""}</span>
          <button 
            className="message__right-side__message-controls_like"
            onClick={likeMessage}
          >
            <LikeIcon fillColor={"#FFFF00"} />
          </button>

          {!currentThread && (
            <p 
              className={data.replyCount ? "message__right-side__message-controls_reply message__right-side__message-controls_reply__has-reply" : "message__right-side__message-controls_reply"}
              onClick={() => setThreadId(threadId)}
            >
              {data.replyCount ? `${data.replyCount} Replies` : "Reply"}
            </p>
          )}
        </div>
      </div>

    </div>
  )
}

export default Message;