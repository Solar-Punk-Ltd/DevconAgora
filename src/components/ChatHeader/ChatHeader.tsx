import React from 'react';

import { CATEGORY_IMAGES_MAP, LOBBY_TITLE } from '../../utils/constants';
import ActiveVisitors from '../ActiveVisitors/ActiveVisitors';

import './ChatHeader.scss';

interface ChatHeaderProps {
  category?: string;
  activeVisitors?: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ category, activeVisitors }) => {
  const imageUrl = CATEGORY_IMAGES_MAP.get(category ? category : '');
  return (
    <div className="chat-header">
      {category !== LOBBY_TITLE && (
        <div className="chat-header__img">
          <img src={imageUrl} alt="" className="chat-header__img" />
        </div>
      )}
      <div className="chat-header__category-name">{category}</div>
      <div>
        <ActiveVisitors number={activeVisitors ? activeVisitors : 0} withIcon={true} />
      </div>
    </div>
  );
};

export default ChatHeader;
