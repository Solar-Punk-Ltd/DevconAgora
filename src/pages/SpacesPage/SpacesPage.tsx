import React, { useState } from "react";
import "./SpacesPage.scss";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import { CATEGORIES, CATEGORY_NAMES_TO_ID_MAP  } from "../../utils/constants";
import SpacesItem from "../../components/Spaces/SpacesItem/SpacesItem";
import { ROUTES } from "../../utils/constants";
import Chat from "../Chat/Chat";
import { BatchId } from "@ethersphere/bee-js";
import { useGlobalState } from "../../GlobalStateContext";
import { getPrivateKey, getResourceId } from "../../utils/helpers";
import HomeBackground from "../../assets/welcome-glass-effect.png";


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
        <img
          src={HomeBackground}
          alt=""
          width="100%"
          height="100%"
          className="spaces__background__img"
        />
      </div>

      <div className="spaces__content">
        {CATEGORIES.map((category) => (
          <div key={category} onClick={() => setSelectedChat(category)}>
            <SpacesItem title={category} numberOfActiveUsers={orderedList.find((room) => room.topic === CATEGORY_NAMES_TO_ID_MAP.get(category))?.userCount || 0} />
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
          gateway={orderedList.find((room) => room.topic === CATEGORY_NAMES_TO_ID_MAP.get(selectedChat))?.gateway || undefined}
          session={undefined}
          topMenuColor={undefined}
          originatorPage={"Spaces"}
          originatorPageUrl={ROUTES.SPACES}
          backAction={() => setSelectedChat(null)}
          key={selectedChat}
        />
      )}
    </div>
  );
};

export default SpacesPage;
