import React, { useState } from "react";
import "./SpacesPage.scss";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";
import {
  CATEGORY_NAMES_TO_ID_MAP,
  RESOURCE_IDS,
  TEST_CATEGORIES,
  TEST_CATEGPRY_NAMES_TO_ID_MAP,
  TEST_RESOURCE_IDS,
} from "../../utils/constants";
import SpacesItem from "../../components/Spaces/SpacesItem/SpacesItem";
import { ROUTES } from "../../utils/constants";
import Chat from "../Chat/Chat";
import { BatchId } from "@ethersphere/bee-js";
import { useGlobalState } from "../../GlobalStateContext";

const SpacesPage: React.FC = () => {
  const { username } = useGlobalState();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  // TODO: do not thorw, show error page just like in talks and notes
  const privKey = localStorage.getItem("privKey");
  if (!privKey) {
    throw new Error("No private key found");
  }

  const TestgetResourceId = (category: string) => {
    const categoryId = TEST_CATEGPRY_NAMES_TO_ID_MAP.get(category);
    if (categoryId) {
      const result = TEST_RESOURCE_IDS.get(categoryId);
      if (result) {
        return result;
      } else {
        return "";
      }
    } else {
      return "";
    }
  };

  const getResourceId = (category: string) => {
    const categoryId = CATEGORY_NAMES_TO_ID_MAP.get(category);
    if (categoryId) {
      const result = RESOURCE_IDS.get(categoryId);
      if (result) {
        return result;
      } else {
        return "";
      }
    } else {
      return "";
    }
  };

  return (
    <div className="spaces">
      <NavigationHeader to={ROUTES.HOME} />
      <NavigationFooter />
      <div className="spaces__content">
        {TEST_CATEGORIES.map((category) => (
          <div key={category} onClick={() => setSelectedChat(category)}>
            <SpacesItem title={category} numberOfActiveUsers={20} />
          </div>
        ))}
      </div>

      {selectedChat && (
        <Chat
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
        />
      )}
    </div>
  );
};

export default SpacesPage;
