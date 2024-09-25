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
import RoomsPage from "./pages/RoomsPage/RoomsPage";
import { ROUTES, FIVE_MINUTES, ADDRESS_HEX_LENGTH } from "./utils/constants";
import { Session } from "./types/session";
import { getFeedUpdate, getSessionsData } from "./utils/bee";
import { BatchId } from "@ethersphere/bee-js";
import { useGlobalState } from "./GlobalStateContext";
import Chat from "./pages/Chat/Chat";

// Chat related variables, later this will be deleted
const TOPIC = "threads-1"
const PRIVKEY = "0x527f11716334d9565179db07bca7de808bda1be8456d00975045ce40b9abf5bb"
const STAMP = "e3b756ad3c4c5bcea52e35cc323807a482e276e3c27edf1dbc1ab287cb9a3395" as BatchId
const GSOC_RESOURCE_ID = "6300000000000000000000000000000000000000000000000000000000000000"

const MainRouter = (): ReactElement => {
  const { username } = useGlobalState();
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
      <Route path={ROUTES.AGENDA} element={<Agenda sessions={sessions} />} />
      <Route path={ROUTES.ROOMS} element={<RoomsPage />} />
      <Route path={"/chat_dev"} element={<Chat
          topic={TOPIC}
          privKey={PRIVKEY}
          stamp={STAMP as BatchId}
          nickname={username}
          gsocResourceId={GSOC_RESOURCE_ID}
          session={undefined && {
            id: "00",
            title: "Ethereum for the next billion: DeFi for the unbanked/underbanked",
            description: "Ethereum for the next billion: DeFi for the unbanked/underbanked",
            sourceId: "123",
            type: "no-type",
            duration: "1 hour",
            expertise: "medium",
            tags: "l2",
            language: "english",
            eventId: "00",
            slot_start: "9:00 AM",
            slot_end: "10:15 AM",
            track: "Layer 2s"
          }}  
          topMenuColor={undefined && "#F1F2F4"}
          originatorPage={"Home"}
          originatorPageUrl={'/home'}
      />} />
    </Routes>
  );
};

export default MainRouter;