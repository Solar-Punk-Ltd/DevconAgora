import React, { useState } from "react";
import "./SpacesPage.scss";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";
import { CATEGORIES, RESOURCE_IDS } from "../../utils/constants";
import SpacesItem from "../../components/Spaces/SpacesItem/SpacesItem";
import { ROUTES } from "../../utils/constants";
import Chat from "../Chat/Chat";
import { BatchId } from "@ethersphere/bee-js";

// Chat related variables, later this will be deleted
const PRIVKEY = "0x527f11716334d9565179db07bca7de808bda1be8456d00975045ce40b9abf5bb";
const STAMP = "e00104768a599d9d08ebdec7fc7f50cc949c7792f3ebf8d621e66fd47bb85f33" as BatchId;


const SpacesPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  return (
    <div className="spaces">
      <NavigationHeader to={ROUTES.HOME} />
      <NavigationFooter />
      <div className="spaces__content">
        {CATEGORIES.map((category) => (
          <div key={category} onClick={() => setSelectedChat(category)}>
            <SpacesItem title={category} numberOfActiveUsers={20} />
          </div>
        ))}
      </div>

      {selectedChat && <Chat
        topic={selectedChat}
        privKey={PRIVKEY}
        stamp={STAMP as BatchId}
        nickname={"P"}
        gsocResourceId={"1405000000000000000000000000000000000000000000000000000000000000"}
        session={undefined}
        topMenuColor={undefined && "#F1F2F4"}
        originatorPage={"Spaces"}
        originatorPageUrl={"/spaces"}
        backAction={() => setSelectedChat(null)}
        key={selectedChat}
      />}
    </div>
  );
};

export default SpacesPage;