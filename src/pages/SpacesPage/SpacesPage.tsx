import React, { useState } from "react";
import "./SpacesPage.scss";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import { CATEGORY_NAMES_TO_ID_MAP, TEST_CATEGORIES, TEST_CATEGPRY_NAMES_TO_ID_MAP } from "../../utils/constants";
import SpacesItem from "../../components/Spaces/SpacesItem/SpacesItem";
import { ROUTES } from "../../utils/constants";
import Chat from "../Chat/Chat";
import { BatchId } from "@ethersphere/bee-js";
import { useGlobalState } from "../../GlobalStateContext";
import { TestgetResourceId } from "../../utils/helpers";
import HomeBackground from "../../assets/welcome-glass-effect.png";


const SpacesPage: React.FC = () => {
  const { username } = useGlobalState();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const privKey = localStorage.getItem("privKey");
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
        {TEST_CATEGORIES.map((category) => (
          <div key={category} onClick={() => setSelectedChat(category)}>
            <SpacesItem title={category} numberOfActiveUsers={20} />
          </div>
        ))}
      </div>

      {selectedChat && (
        <Chat
          title={selectedChat}
          topic={TEST_CATEGPRY_NAMES_TO_ID_MAP.get(selectedChat)}
          privKey={privKey}
          stamp={process.env.STAMP as BatchId}
          nickname={username}
          gsocResourceId={TestgetResourceId(selectedChat)}
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
