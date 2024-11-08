import React from "react";
import { useState } from "react";
import { useGlobalState } from "../../GlobalStateContext";
import "./HomePage.scss";
import DevConMainBox from "../../components/DevConMainBox/DevConMainBox";
import RecentSessions from "../../components/RecentSessions/RecentSessions";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import HomeHeader from "../../components/HomeHeader/HomeHeader";
import HomeBackground from "../../assets/welcome-glass-effect.png";
import Spaces from "../../components/Spaces/Spaces";
import Chat from "../Chat/Chat";
import { BatchId } from "@ethersphere/bee-js";
import { getPrivateKey, getResourceId } from "../../utils/helpers";
import { LOBBY_TITLE, CATEGORY_NAMES_TO_ID_MAP } from "../../utils/constants";

interface HomePageProps {
  withGamification?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ withGamification }) => {
  const { points, username, orderedList } = useGlobalState();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const privKey = getPrivateKey();
  if (!privKey) {
    return (
      <div className="home-page-error">
        No private key found
        <NavigationFooter />
      </div>
    );
  }

  const anyRoomUserCount = (roomName: string): number => {
    const anyRoom = orderedList.find((room) => room.topic === roomName);
    if (!anyRoom) return 0;
    if (anyRoom.userCount) return anyRoom.userCount;
    else return 0;
  };

  const lobbyUserCount = (): number => {
    const lobby = orderedList.find((room) => room.topic === LOBBY_TITLE);
    if (!lobby) return 0;
    if (lobby.userCount) return lobby.userCount;
    else return 0;
  };

  return (
    <div className="home-page">
      <div className="home-page__background">
        <img src={HomeBackground} alt="" width="100%" height="100%" />
      </div>

      <HomeHeader points={points} withGamification={withGamification} />

      <div className="home-page__content">
        <DevConMainBox
          title="Devcon buzz space"
          content="Share your thoughts, chat with anyone without moderation, and collect your reward."
          showActiveVisitors={true}
          activeVisitors={lobbyUserCount()}
          bordered={true}
          setSelectedChat={setSelectedChat}
        />
        <RecentSessions />
        <Spaces list={orderedList} setSelectedChat={setSelectedChat} />
      </div>

      <NavigationFooter />

      {selectedChat && (
        <Chat
          title={selectedChat}
          topic={CATEGORY_NAMES_TO_ID_MAP.get(selectedChat)}
          privKey={privKey}
          stamp={process.env.STAMP as BatchId}
          nickname={username}
          gsocResourceId={getResourceId(selectedChat)}
          gateway={
            orderedList.find(
              (room) =>
                room.topic === CATEGORY_NAMES_TO_ID_MAP.get(selectedChat)
            )?.gateway || undefined
          }
          topMenuColor={undefined}
          backAction={() => setSelectedChat(null)}
          key={selectedChat}
          activeNumber={anyRoomUserCount(
            CATEGORY_NAMES_TO_ID_MAP.get(selectedChat)
          )}
        />
      )}
    </div>
  );
};

export default HomePage;
