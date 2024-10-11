import React from "react";
import DevConMainBox from "../../components/DevConMainBox/DevConMainBox";
import RecentSessions from "../../components/RecentSessions/RecentSessions";
import "./HomePage.scss";
import { useEffect, useState } from "react";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import HomeHeader from "../../components/HomeHeader/HomeHeader";
import HomeBackground from "../../assets/welcome-glass-effect.png";
import HomeLoading from "../../components/HomeLoading/HomeLoading";
import Spaces from "../../components/Spaces/Spaces";
import { useGlobalState } from "../../GlobalStateContext";
import Chat from "../Chat/Chat";
import { BatchId } from "@ethersphere/bee-js";
import { TestgetResourceId,  getResourceId } from "../../utils/helpers";
import { ROUTES } from "../../utils/constants";

const maxSessionsShown = 9;

interface HomePageProps {
  isLoaded?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isLoaded }) => {
  const { username, sessions } = useGlobalState();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { points } = useGlobalState();

  const privKey = localStorage.getItem("privKey");
  if (!privKey) {
    throw new Error("No private key found");
  }

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
      <HomeHeader points={points} />
      {isLoading ? (
        <HomeLoading />
      ) : (
        <div className="home-page__content">
          <DevConMainBox
            title="Devcon buzz space"
            content="Share your tought, chat with anybody without moderation and collect the reward."
            showActiveVisitors={true}
            activeVisitors={110}
            bordered={true}
            setSelectedChat={setSelectedChat}
          />
          <RecentSessions
            sessions={sessions}
            maxSessionsShown={maxSessionsShown}
          />
          <Spaces 
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        </div>
      )}
      <NavigationFooter />

      {selectedChat && <Chat
        topic={selectedChat}
        privKey={privKey}
        stamp={process.env.STAMP as BatchId}
        nickname={username}
        gsocResourceId={TestgetResourceId(selectedChat)}
        session={undefined}
        topMenuColor={undefined}
        originatorPage={"Home"}
        originatorPageUrl={ROUTES.HOME}
        backAction={() => setSelectedChat(null)}
        key={selectedChat}
      />}
    </div>
  );
};

export default HomePage;
