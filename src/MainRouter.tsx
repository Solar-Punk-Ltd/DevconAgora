import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
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
import Chat from "./pages/Chat/Chat";
import { BatchId } from "@ethersphere/bee-js";
// import Categories from "./pages/Categories/Categories";

export enum ROUTES {
  APP = "/",
  WELCOME1 = "/welcome1",
  WELCOME2 = "/welcome2",
  WELCOME3 = "/welcome3",
  WELCOME4 = "/welcome4",
  PROFILECREATION = "/profilecreation",
  HOME = "/home",
  RECENT = "/recent",
  DEVCONLOUNGE = "/devconlounge",
  PROFILE = "/profile",
  GAMIFICATION = "/gamification",
  AGENDA = "/agenda",
  CATEGORIES = "/categories",
}

const MainRouter = (): ReactElement => {
  const [sessions, setSessions] = useState(new Map<string, Session[]>());
  const [sessionsReference, setSessionsReference] = useState<string>("");
  const [isBeeRunning, setBeeRunning] = useState(false);

  async function checkBee() {
    fetch(
      process.env.BEE_API_URL + "bytes/" + process.env.HEALTH_CHECK_DATA_REF
    )
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

  useEffect(() => {
    // TODO: what shall be the update time ?
    checkBee();
    const interval = setInterval(() => {
      checkBee();
    }, FIVE_MINUTES);
    return () => clearInterval(interval);
  }, []);

  const fetchFeedUpdate = useCallback(async () => {
    if (isBeeRunning) {
      const ref = await getFeedUpdate();
      if (ref.length === ADDRESS_HEX_LENGTH && ref !== sessionsReference) {
        console.log("sessions reference updated: ", ref);
        setSessionsReference(() => ref);
      }
    }
  }, [isBeeRunning]);

  useEffect(() => {
    fetchFeedUpdate();
    const interval = setInterval(async () => {
      fetchFeedUpdate();
    }, FIVE_MINUTES);

    return () => clearInterval(interval);
  }, [fetchFeedUpdate]);

  const fetchSessions = useCallback(async () => {
    if (sessionsReference.length === ADDRESS_HEX_LENGTH) {
      const data = await getSessionsData(sessionsReference);
      console.log("session data updated");
      setSessions(() => data);
    }
  }, [sessionsReference]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

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
      <Route path={ROUTES.AGENDA} element={<Agenda />} />
      <Route path={"/chat_dev"} element={<Chat 
          topic={"gsoc-11"}
          privKey={"0x527f11716334d9565179db07bca7de808bda1be8456d00975045ce40b9abf5bb"}
          stamp={"03263b84b1263899b4e63ea6b2ce4fb252c280a31a128b5d54f44cd0807c9e0e" as BatchId}
          nickname={"Peter"}
          gsocResourceId={"f6b7beefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef"}
      />} />
      {/* <Route path={ROUTES.CATEGORIES} element={<Categories />} /> */}
    </Routes>
  );
};

export default MainRouter;
