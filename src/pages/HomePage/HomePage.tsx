import React from "react";
import DevConMainBox from "../../components/DevConMainBox/DevConMainBox";
import RecentSessions from "../../components/RecentSessions/RecentSessions";
import "./HomePage.scss";
import { useEffect, useState } from "react";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import HomeHeader from "../../components/HomeHeader/HomeHeader";
import HomeBackground from "../../assets/welcome-glass-effect.png";
import HomeLoading from "../../components/HomeLoading/HomeLoading";
import { Session } from "../../types/session";
import Spaces from "../../components/Spaces/Spaces";
import { useGlobalState } from "../../GlobalStateContext";

const maxSessionsShown = 9;

interface HomePageProps {
  sessions: Map<string, Session[]>;
  isLoaded?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ sessions, isLoaded }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { points } = useGlobalState();

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
          />
          <RecentSessions
            sessions={sessions}
            maxSessionsShown={maxSessionsShown}
          />
          <Spaces />
        </div>
      )}
      <NavigationFooter />
    </div>
  );
};

export default HomePage;
