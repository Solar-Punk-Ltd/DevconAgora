import React from "react";
import { useGlobalState } from "../../GlobalStateContext";
import "./HomePage.scss";
import DevConMainBox from "../../components/DevConMainBox/DevConMainBox";
import RecentSessions from "../../components/RecentSessions/RecentSessions";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import HomeHeader from "../../components/HomeHeader/HomeHeader";
import HomeBackground from "../../assets/welcome-glass-effect.png";
import Spaces from "../../components/Spaces/Spaces";
import { LOBBY_TITLE, CATEGORIES } from "../../utils/constants";

interface HomePageProps {
  withGamification?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ withGamification }) => {
  const { points, spacesActivity } = useGlobalState();
  const lobbyActivity = spacesActivity.get(LOBBY_TITLE) || 0;
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
          showActiveVisitors={lobbyActivity > 0}
          activeVisitors={lobbyActivity}
          bordered={true}
        />
        <RecentSessions />
        <Spaces
          list={CATEGORIES.map((c) => ({
            topic: c,
            userCount: spacesActivity.get(c) || 0,
          }))}
        />
      </div>

      <NavigationFooter />
    </div>
  );
};

export default HomePage;
