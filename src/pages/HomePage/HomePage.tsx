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
import { Session } from "../../types/session";
import { LOBBY_TITLE } from "../../utils/constants";
import TalkItem from "../../components/TalkItem/TalkItem";

interface HomePageProps {
  withGamification?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ withGamification }) => {
  const { points, orderedList } = useGlobalState();
  const [selectedTalk, setSelectedTalk] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const handleOnClick = (category: string) => {
    const sess: Session = {
      id: category,
      sourceId: category,
      title: category,
      track: category,
      slot_start: new Date().toLocaleString(),
      slot_end: new Date().toLocaleString(),
      slot_roomId: category,
    };
    setSelectedTalk(category);
    setSession(sess);
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
          setSelectedTalk={handleOnClick}
        />
        <RecentSessions />
        <Spaces list={orderedList} setSelectedTalk={handleOnClick} />
      </div>

      <NavigationFooter />

      {selectedTalk && session && <TalkItem session={session} />}
    </div>
  );
};

export default HomePage;
