import React, { useEffect, useRef, useState } from "react";

import DevConMainBox from "../../components/DevConMainBox/DevConMainBox";
import HomeHeader from "../../components/HomeHeader/HomeHeader";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import RecentSessions from "../../components/RecentSessions/RecentSessions";
import Spaces from "../../components/Spaces/Spaces";
import { CATEGORIES, LOBBY_TITLE } from "../../constants/categories";
import { useGlobalState } from "../../contexts/global";
import { usePreload } from "../../hooks/usePreload";

import "./Home.scss";

const Home: React.FC = () => {
  const { spacesActivity } = useGlobalState();
  const { calcSpacesActivity } = usePreload();
  const lobbyActivity = spacesActivity.get(LOBBY_TITLE) || 0;

  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const contentScrollTop = contentRef.current ? contentRef.current.scrollTop : 0;
      const windowScrollTop = window.scrollY || document.documentElement.scrollTop;
      const bodyScrollTop = document.body.scrollTop;

      const scrollTop = Math.max(contentScrollTop, windowScrollTop, bodyScrollTop);
      const nowScrolledDown = scrollTop > 0;

      setIsScrolledDown(nowScrolledDown);
    };

    const element = contentRef.current;

    if (element) {
      element.addEventListener("scroll", handleScroll);
    }

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("scroll", handleScroll);

    handleScroll();

    const interval = setInterval(handleScroll, 100);

    return () => {
      if (element) {
        element.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, [isScrolledDown]);

  const handleSpacesRefresh = async () => {
    await calcSpacesActivity();
  };
  return (
    <div className="home-page">
      <div className="home-page__background grid">{/* <img src={HomeBackground} alt="" width="100%" height="100%" /> */}</div>

      <HomeHeader />

      <div ref={contentRef} className="home-page__content">
        <DevConMainBox
          title="BBW2025 Space"
          content="Share your thoughts, engage in open conversations!"
          showActiveVisitors={lobbyActivity > 0}
          activeVisitors={lobbyActivity}
          bordered={true}
        />
        <RecentSessions isParentScrolledDown={isScrolledDown} />
        <Spaces
          list={CATEGORIES.map((c) => ({
            topic: c,
            userCount: spacesActivity.get(c) || 0,
          }))}
          onRefresh={handleSpacesRefresh}
          isParentScrolledDown={isScrolledDown}
        />
      </div>

      <NavigationFooter />
    </div>
  );
};

export default Home;
