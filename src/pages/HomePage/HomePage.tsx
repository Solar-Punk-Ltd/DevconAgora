import React from "react";
import DevConMainBox from "../../components/DevConMainBox/DevConMainBox";
import RecentSessions from "../../components/RecentSessions/RecentSessions";
import "./HomePage.scss";
import { useEffect, useState } from "react";
import RecentRooms from "../../components/RecentRooms/RecentRooms";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import HomeHeader from "../../components/HomeHeader/HomeHeader";
import HomeBackground from "../../assets/welcome-glass-effect.png";
import HomeLoading from "../../components/HomeLoading/HomeLoading";
import { Session } from "../../types/session";

const maxSessionsShown = 9;

interface HomePageProps {
  sessions: Map<string, Session[]>;
  isLoaded?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ sessions, isLoaded }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      <HomeHeader points={10} />
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
          <RecentRooms />
        </div>
      )}
      <NavigationFooter />
    </div>
  );
};

export default HomePage;
