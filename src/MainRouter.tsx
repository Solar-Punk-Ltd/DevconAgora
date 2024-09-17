import React, { ReactElement, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Bee } from "@ethersphere/bee-js";
import App from "./App";
import Welcome1 from "./pages/Welcome1/Welcome1";
import Welcome2 from "./pages/Welcome2/Welcome2";
import Welcome3 from "./pages/Welcome3/Welcome3";
import Welcome4 from "./pages/Welcome4/Welcome4";
import ProfileCreation from "./pages/ProfileCreation/ProfileCreation";
import HomePage from "./pages/HomePage/HomePage";
import Recent from "./pages/Recent/Recent";
import DevconLounge from "./pages/DevconLounge/DevconLounge";
import Profile from "./pages/Profile/Profile";
import Gamification from "./components/Gamification/Gamification";
import Agenda from "./pages/Agenda/Agenda";
import {
  ROUTES,
  FIVE_MINNUTES,
  FEEDTYPE_SEQUENCE,
  ADDRESS_HEX_LENGTH,
} from "./utils/constants";
import { Session } from "./types/session";

const MainRouter = (): ReactElement => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsReference, setSessionsReference] = useState<string>("");
  const [isBeeRunning, setBeeRunning] = useState(false);

  const bee = new Bee(process.env.BEE_API_URL || "http://localhost:1633/");
  const rawFeedTopicSession = "sessions";
  const maxSessionsShown = 8;

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

  async function getSessions(ref: string) {
    if (ref.length !== ADDRESS_HEX_LENGTH) {
      console.log("session hash invalid");
      return;
    }

    try {
      const data = JSON.parse((await bee.downloadData(ref)).text());
      const s: Session[] = data.data.items;
      setSessions(s);
    } catch (e) {
      console.log("session " + ref + " download/cast error", e);
    }
  }

  useEffect(() => {
    checkBee();
  });

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
    if (isBeeRunning && sessionsReference.length === ADDRESS_HEX_LENGTH) {
      getSessions(sessionsReference);
    }
  }, [isBeeRunning, sessionsReference]);

  return (
    <Routes>
      <Route path={ROUTES.APP} element={<App />} />
      <Route path={ROUTES.WELCOME1} element={<Welcome1 />} />
      <Route path={ROUTES.WELCOME2} element={<Welcome2 />} />
      <Route path={ROUTES.WELCOME3} element={<Welcome3 />} />
      <Route path={ROUTES.WELCOME4} element={<Welcome4 />} />
      <Route path={ROUTES.PROFILECREATION} element={<ProfileCreation />} />
      <Route
        path={ROUTES.HOME}
        element={<HomePage sessions={sessions} isLoaded={false} />}
      />
      <Route path={ROUTES.RECENT} element={<Recent />} />
      <Route path={ROUTES.DEVCONLOUNGE} element={<DevconLounge />} />
      <Route path={ROUTES.PROFILE} element={<Profile />} />
      <Route path={ROUTES.GAMIFICATION} element={<Gamification />} />
      <Route
        path={ROUTES.AGENDA}
        element={
          <Agenda sessions={sessions} maxSessionsShown={maxSessionsShown} />
        }
      />
      {/* <Route path={ROUTES.CATEGORIES} element={<Categories />} /> */}
    </Routes>
  );
};

export default MainRouter;
