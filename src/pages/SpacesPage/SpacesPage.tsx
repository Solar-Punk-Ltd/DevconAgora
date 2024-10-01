import React, { useState } from "react";
import "./SpacesPage.scss";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";
import { CATEGORIES, CATEGORY_NAMES_TO_ID_MAP, RESOURCE_IDS, TEST_CATEGORIES, TEST_CATEGPRY_NAMES_TO_ID_MAP, TEST_RESOURCE_IDS } from "../../utils/constants";
import SpacesItem from "../../components/Spaces/SpacesItem/SpacesItem";
import { ROUTES } from "../../utils/constants";
import Chat from "../Chat/Chat";
import { BatchId } from "@ethersphere/bee-js";

// Chat related variables, later this will be deleted
const PRIVKEY = "0x527f11716334d9565179db07bca7de808bda1be8456d00975045ce40b9abf5bb";
const STAMP = "5c2a4f00ff17374a9d1ed8e148dc4ed5c3df12f1f0c10d37299db51a3bce0399" as BatchId;

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
}

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
}

const SpacesPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

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

      {selectedChat && <Chat
        topic={selectedChat}
        privKey={PRIVKEY}
        stamp={STAMP as BatchId}
        nickname={"P"}
        gsocResourceId={TestgetResourceId(selectedChat)}
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