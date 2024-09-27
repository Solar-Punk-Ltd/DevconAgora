import React, { useState } from "react";
import "./SpacesPage.scss";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";
import { CATEGORIES } from "../../utils/constants";
import SpacesItem from "../../components/Spaces/SpacesItem/SpacesItem";
import { ROUTES } from "../../utils/constants";
import Chat from "../Chat/Chat";
import { BatchId } from "@ethersphere/bee-js";

// Chat related variables, later this will be deleted
const TOPIC = "threads-5";
const PRIVKEY = "0x527f11716334d9565179db07bca7de808bda1be8456d00975045ce40b9abf5bb";
const STAMP = "b7344c4b8e6a74a8305084294180507c6ec72a6badf80b757d5256f43e63e8a9" as BatchId;
const GSOC_RESOURCE_ID = "3805000000000000000000000000000000000000000000000000000000000000";


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
        topic={TOPIC}
        privKey={PRIVKEY}
        stamp={STAMP as BatchId}
        nickname={"P"}
        gsocResourceId={GSOC_RESOURCE_ID}
        session={undefined}
        topMenuColor={undefined && "#F1F2F4"}
        originatorPage={"Home"}
        originatorPageUrl={"/home"}
      />}
    </div>
  );
};

export default SpacesPage;

/*
undefined && {
            id: "00",
            title:
              "Ethereum for the next billion: DeFi for the unbanked/underbanked",
            description:
              "Ethereum for the next billion: DeFi for the unbanked/underbanked",
            sourceId: "123",
            type: "no-type",
            duration: "1 hour",
            expertise: "medium",
            tags: "l2",
            language: "english",
            eventId: "00",
            slot_start: "9:00 AM",
            slot_end: "10:15 AM",
            track: "Layer 2s",
          }*/