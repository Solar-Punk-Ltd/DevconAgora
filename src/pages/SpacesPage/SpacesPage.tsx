import React, { useState } from 'react';
import { BatchId } from '@ethersphere/bee-js';

import HomeBackground from '../../assets/welcome-glass-effect.png';
import NavigationFooter from '../../components/NavigationFooter/NavigationFooter';
import SpacesItem from '../../components/Spaces/SpacesItem/SpacesItem';
import { useGlobalState } from '../../contexts/global';
import { CATEGORIES, CATEGORY_NAMES_TO_ID_MAP } from '../../utils/constants';
import { getPrivateKey, getResourceId } from '../../utils/helpers';
import Chat from '../Chat/Chat';

import './SpacesPage.scss';

const SpacesPage: React.FC = () => {
  const { username, orderedList } = useGlobalState();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const privKey = getPrivateKey();
  if (!privKey) {
    return (
      <div className="spaces-page-error">
        No private key found
        <NavigationFooter />
      </div>
    );
  }

  return (
    <div className="spaces">
      <NavigationFooter />
      <div className="spaces__background">
        <img src={HomeBackground} alt="" width="100%" height="100%" className="spaces__background__img" />
      </div>

      <div className="spaces__content">
        {CATEGORIES.map((category) => (
          <div key={category} onClick={() => setSelectedChat(category)}>
            <SpacesItem
              title={category}
              numberOfActiveUsers={
                orderedList.find((room) => room.topic === CATEGORY_NAMES_TO_ID_MAP.get(category))?.userCount || 0
              }
            />
          </div>
        ))}
      </div>

      {selectedChat && (
        <Chat
          title={selectedChat}
          topic={CATEGORY_NAMES_TO_ID_MAP.get(selectedChat)}
          privKey={privKey}
          stamp={process.env.STAMP as BatchId}
          nickname={username}
          gsocResourceId={getResourceId(selectedChat)}
          gateway={
            orderedList.find((room) => room.topic === CATEGORY_NAMES_TO_ID_MAP.get(selectedChat))?.gateway || undefined
          }
          topMenuColor={undefined}
          backAction={() => setSelectedChat(null)}
          key={selectedChat}
        />
      )}
    </div>
  );
};

export default SpacesPage;
