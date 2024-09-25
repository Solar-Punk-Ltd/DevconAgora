import React from 'react';
import "./Message.scss";
import AvatarMonogram from '../../AvatarMonogram/AvatarMonogram';
import LikeIcon from '../../icons/LikeIcon/LikeIcon';
import { createMonogram, formatTime } from '../../../utils/helpers';
import { MessageWithThread, ThreadId } from '../../../types/message';

interface MessageProps {
    data: MessageWithThread;
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
    <div className="message" style={{ marginLeft: parent ? "128px" : undefined}}>
     
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