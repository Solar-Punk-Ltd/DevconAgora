import React from 'react';
import "./Message.scss";
import { MessageData } from 'solarpunk-swarm-decentralized-chat';
import AvatarMonogram from '../../AvatarMonogram/AvatarMonogram';
import { useGlobalState } from '../../../GlobalStateContext';
import LikeIcon from '../../icons/LikeIcon/LikeIcon';
import { createMonogram, formatTime } from '../../../utils/helpers';
import { ThreadId } from '../../../types/message';

interface MessageProps {
    data: MessageData;
    currentThread: ThreadId | null;
    threadId: ThreadId | null;
    parent: ThreadId | null;
    setThreadId: React.Dispatch<React.SetStateAction<string | null>>;
}

const Message: React.FC<MessageProps> = ({
    data,
    currentThread,
    threadId,
    parent,
    setThreadId
}) => {
  return (
    <div className="message">
     
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
          <LikeIcon />
          {threadId && (
            <p 
              className="message__right-side__message-controls_reply"
              onClick={() => setThreadId(threadId)}
            >
              {"Reply"}
            </p>
          )}
        </div>
      </div>

    </div>
  )
}

export default Message;