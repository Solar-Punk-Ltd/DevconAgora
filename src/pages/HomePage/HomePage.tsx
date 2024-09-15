import React from "react";
import DevConMainBox from "../../components/DevConMainBox/DevConMainBox";
import RecentSessions from "../../components/RecentSessions/RecentSessions";
import "./HomePage.scss";
import { Session } from "../../types/session";
import { useEffect, useState } from "react";
import { Swarm } from "libswarm";
import RecentRooms from "../../components/RecentRooms/RecentRooms";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import HomeHeader from "../../components/HomeHeader/HomeHeader";
import HomeBackground from "../../assets/welcome-glass-effect.png";
import HomeLoading from "../../components/HomeLoading/HomeLoading";
import {
  FIVE_MINNUTES,
  FEEDTYPE_SEQUENCE,
  ADDRESS_HEX_LENGTH,
} from "../../utils/constants";
import { Bee } from "@ethersphere/bee-js";

const maxSessionsShown = 9;
const rawFeedTopicSession = "sessions";

interface HomePageProps {
  isLoaded?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isLoaded }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsReference, setSessionsReference] = useState<string>("");
  const [isBeeRunning, setBeeRunning] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // TODO: is libswarm needed at all ?
  const swarm = new Swarm({
    beeApi: process.env.BEE_API_URL,
    postageBatchId: "todo dummy",
  });

  const bee = new Bee(process.env.BEE_API_URL || "http://localhost:1633/");

  async function checkBee() {
    fetch(process.env.BEE_API_URL + "addresses")
      .then(async () => {
        if (!isBeeRunning) {
          setBeeRunning(true);
          console.log("Bee is running");
        }
      })
      .catch(() => {
        setBeeRunning(false);
        console.log("Bee stopped running");
      });
  }

  async function getSessions(ref: string) {
    if (ref.length !== ADDRESS_HEX_LENGTH) {
      console.log("session hash invalid");
      return;
    }

    try {
      const data = JSON.parse(
        (await swarm.downloadRawData(ref, "application/json")).utf8
      );
      const s: Session[] = data.data.items;
      setSessions(sessions.concat(s));
    } catch (e) {
      console.log("session " + ref + " download/cast error", e);
    }
  }

  useEffect(() => {
    checkBee();
  });

  async function getFeedUpdate() {
    if (isBeeRunning) {
      const sessionFeedTopic = bee.makeFeedTopic(rawFeedTopicSession);
      const feedReader = bee.makeFeedReader(
        FEEDTYPE_SEQUENCE,
        sessionFeedTopic,
        process.env.FEED_OWNER_ADDRESS as string
      );
      try {
        const feedUpdateRes = await feedReader.download();
        const feedRef = feedUpdateRes.reference as string;
        if (feedRef !== sessionsReference) {
          // TODO: somehow this if re-evaluates becausue sessionsReference is always empty
          setSessionsReference(feedRef);
          console.log("sessions reference updated: ", feedRef);
        }
      } catch (e) {
        console.log("feed download error", e);
      }
    }
  }

  useEffect(() => {
    getFeedUpdate();
    // const feedUpdateInterval = 5000; // 5 seconds
    const feedUpdateInterval = FIVE_MINNUTES;
    const interval = setInterval(async () => {
      getFeedUpdate();
    }, feedUpdateInterval);

    return () => clearInterval(interval);
  }, [isBeeRunning]);

  useEffect(() => {
    if (isBeeRunning) {
      getSessions(sessionsReference);
    }
  }, [isBeeRunning, sessionsReference]);

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
            maxNumOfSessions={maxSessionsShown}
          />
          <RecentRooms />
        </div>
      )}
      <NavigationFooter />
    </div>
  );
};

export default HomePage;
