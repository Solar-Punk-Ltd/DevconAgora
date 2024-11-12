import React from "react";
import { useGlobalState } from "../../GlobalStateContext";
import "./HomePage.scss";
import DevConMainBox from "../../components/DevConMainBox/DevConMainBox";
import RecentSessions from "../../components/RecentSessions/RecentSessions";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import HomeHeader from "../../components/HomeHeader/HomeHeader";
import HomeBackground from "../../assets/welcome-glass-effect.png";
import Spaces from "../../components/Spaces/Spaces";
import { LOBBY_TITLE } from "../../utils/constants";

interface HomePageProps {
  withGamification?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ withGamification }) => {
  const { points, orderedList } = useGlobalState();

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
        />
        <RecentSessions />
        <Spaces list={orderedList} />
      </div>

      <NavigationFooter />
    </div>
  );
};

export default HomePage;
