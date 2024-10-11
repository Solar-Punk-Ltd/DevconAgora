import React, { useState } from "react";
import "./SpacesPage.scss";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";
import { CATEGORIES, TEST_CATEGORIES } from "../../utils/constants";
import SpacesItem from "../../components/Spaces/SpacesItem/SpacesItem";
import { ROUTES } from "../../utils/constants";
import Chat from "../Chat/Chat";
import { BatchId } from "@ethersphere/bee-js";
import { useGlobalState } from "../../GlobalStateContext";
import { TestgetResourceId } from "../../utils/helpers";


const SpacesPage: React.FC = () => {
  const { username } = useGlobalState();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const privKey = localStorage.getItem("privKey");
  if (!privKey) {
    throw new Error("No private key found");
  }

  
  return (
    <div className="spaces">
      <NavigationFooter />
      
      <div className="spaces__content">
        {TEST_CATEGORIES.map((category) => (
          <div key={category} onClick={() => setSelectedChat(category)}>
            <SpacesItem title={category} numberOfActiveUsers={20} />
          </div>
        ))}
      </div>

      {selectedChat && <Chat
        topic={selectedChat}
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
      />}
    </div>
  );
};

export default SpacesPage;