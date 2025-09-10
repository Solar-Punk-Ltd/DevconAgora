import React from "react";

import DevConMainBox from "../../components/DevConMainBox/DevConMainBox";
import HomeHeader from "../../components/HomeHeader/HomeHeader";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import RecentSessions from "../../components/RecentSessions/RecentSessions";
import Spaces from "../../components/Spaces/Spaces";
import { useGlobalState } from "../../contexts/global";
import { CATEGORIES, LOBBY_TITLE } from "../../utils/constants";

import "./Home.scss";

interface HomePageProps {
  withGamification?: boolean;
}

const Home: React.FC<HomePageProps> = ({ withGamification }) => {
  const { points, spacesActivity } = useGlobalState();
  const lobbyActivity = spacesActivity.get(LOBBY_TITLE) || 0;
  return (
    <div className="home-page">
      <div className="home-page__background grid">{/* <img src={HomeBackground} alt="" width="100%" height="100%" /> */}</div>

      <HomeHeader points={points} withGamification={withGamification} />

      <div className="home-page__content">
        <DevConMainBox
          title="BBW2025 Space"
          content="Share your thoughts, engage in open conversations & earn reward for your participation!"
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

export default Home;
