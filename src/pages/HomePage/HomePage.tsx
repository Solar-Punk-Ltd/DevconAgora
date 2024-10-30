import React from "react";
import { useEffect, useState } from "react";
import { useGlobalState } from "../../GlobalStateContext";
import "./HomePage.scss";
import DevConMainBox from "../../components/DevConMainBox/DevConMainBox";
import RecentSessions from "../../components/RecentSessions/RecentSessions";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import HomeHeader from "../../components/HomeHeader/HomeHeader";
import HomeBackground from "../../assets/welcome-glass-effect.png";
import HomeLoading from "../../components/HomeLoading/HomeLoading";
import Spaces from "../../components/Spaces/Spaces";
import Chat from "../Chat/Chat";
import { BatchId } from "@ethersphere/bee-js";
import { getPrivateKey, getResourceId } from "../../utils/helpers";
import {
  ROUTES,
  LOBBY_TITLE,
  CATEGORY_NAMES_TO_ID_MAP,
  CATEGORIES,
} from "../../utils/constants";
import { RoomWithUserCounts } from "../../types/room";

interface HomePageProps {
  isLoaded?: boolean;
  withGamification?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isLoaded, withGamification }) => {
  const { points, username } = useGlobalState();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderedList, setOrderedList] = useState<RoomWithUserCounts[]>(
    CATEGORIES.map((catName) => ({
      topic: catName,
      url: "null",
      gateway: "null",
      userCount: undefined,
    }))
  );

  const privKey = getPrivateKey();
  if (!privKey) {
    return (
      <div className="home-page-error">
        No private key found
        <NavigationFooter />
      </div>
    );
  }

  // User count refreshes every 15 minutes on backend. With this function, we fetch the stored values.
  const fetchUserCount = async () => {
    const roomsWithUserCount: RoomWithUserCounts[] = await fetch(
      process.env.BACKEND_API_URL + "/user-count"
    )
      .then((res) => res.json())
      .catch((err) => console.error("Error fetching user counts ", err));

    if (roomsWithUserCount !== undefined) {
      const orderedRooms = roomsWithUserCount.sort(
        (a, b) => b.userCount! - a.userCount!
      );
      setOrderedList(orderedRooms);
    }

    console.log("Rooms with user counts: ", orderedList);
  };

  const lobbyeUserCount = (): number => {
    const lobby = orderedList.find((room) => room.topic === LOBBY_TITLE);
    if (!lobby) return 0;
    if (lobby.userCount) return lobby.userCount;
    else return 0;
  };

  // We are reading user count values, when the component loads, and when selectedChat changes
  // (user is closing the Chat, and coming back to the Home Page)
  useEffect(() => {
    fetchUserCount();
  }, [selectedChat]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setIsLoading(false);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-page">
      {!isLoading ? (
        <div className="home-page__background">
          <img src={HomeBackground} alt="" width="100%" height="100%" />
        </div>
      ) : null}
      <HomeHeader points={points} withGamification={withGamification} />
      {isLoading ? (
        <HomeLoading />
      ) : (
        <div className="home-page__content">
          <DevConMainBox
            title="Devcon buzz space"
            content="Share your tought, chat with anybody without moderation and collect the reward."
            showActiveVisitors={true}
            activeVisitors={lobbyeUserCount()}
            bordered={true}
            setSelectedChat={setSelectedChat}
          />
          <RecentSessions />
          <Spaces list={orderedList} setSelectedChat={setSelectedChat} />
        </div>
      )}
      <NavigationFooter />

      {selectedChat && (
        <Chat
          title={selectedChat}
          topic={CATEGORY_NAMES_TO_ID_MAP.get(selectedChat)}
          privKey={privKey}
          stamp={process.env.STAMP as BatchId}
          nickname={username}
          gsocResourceId={getResourceId(selectedChat)}
          session={undefined}
          topMenuColor={undefined}
          originatorPage={"Home"}
          originatorPageUrl={ROUTES.HOME}
          backAction={() => setSelectedChat(null)}
          key={selectedChat}
        />
      )}
    </div>
  );
};

export default HomePage;
