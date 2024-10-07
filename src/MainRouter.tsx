import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import Welcome1 from "./pages/Welcome1/Welcome1";
import Welcome2 from "./pages/Welcome2/Welcome2";
import Welcome3 from "./pages/Welcome3/Welcome3";
import Welcome4 from "./pages/Welcome4/Welcome4";
import ProfileCreation from "./pages/ProfileCreation/ProfileCreation";
import HomePage from "./pages/HomePage/HomePage";
import DevconLounge from "./pages/DevconLounge/DevconLounge";
import Profile from "./pages/Profile/Profile";
import Gamification from "./components/Gamification/Gamification";
import Agenda from "./pages/Agenda/Agenda";
import SpacesPage from "./pages/SpacesPage/SpacesPage";
import { ROUTES, FIVE_MINUTES, ADDRESS_HEX_LENGTH } from "./utils/constants";
import { Session } from "./types/session";
import { getFeedUpdate, getSessionsData } from "./utils/bee";
import HowDoesItWork from "./pages/HowDoesItWork/HowDoesItWork";
import { useGlobalState } from "./GlobalStateContext";
import ClaimRewardPage from "./pages/ClaimRewardPage/ClaimRevardPage";
import ContentFilterPage from "./pages/ContentFilterPage/ContentFilterPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage/TermsAndConditionsPage";
import NotesPage from "./pages/NotesPage/NotesPage";

const MainRouter = (): ReactElement => {
  const { showGamification, setShowGamification, points } = useGlobalState();
  const [sessions, setSessions] = useState(new Map<string, Session[]>());
  const [sessionsReference, setSessionsReference] = useState<string>("");
  const [isBeeRunning, setBeeRunning] = useState(false);

  const setVhVariable = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  useEffect(() => {
    setVhVariable();
    window.addEventListener("resize", setVhVariable);
    return () => {
      window.removeEventListener("resize", setVhVariable);
    };
  }, []);

  const checkBee = async () => {
    fetch(
      process.env.BEE_API_URL + "/bytes/" + process.env.HEALTH_CHECK_DATA_REF
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
  };

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

  useEffect(() => {
    if (points > 0) {
      setShowGamification(true);
    } else {
      setShowGamification(false);
    }
  }, [points]);

  return (
    <>
      {showGamification ? <Gamification points={points} /> : null}
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
        <Route path={ROUTES.DEVCONLOUNGE} element={<DevconLounge />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.AGENDA} element={<Agenda sessions={sessions} />} />
        <Route path={ROUTES.SPACES} element={<SpacesPage />} />
        <Route path={ROUTES.HOWDOESITWORK} element={<HowDoesItWork />} />
        <Route path={ROUTES.CLAIMREWARD} element={<ClaimRewardPage />} />
        <Route path={ROUTES.CONTENTFILTER} element={<ContentFilterPage />} />
        <Route path={ROUTES.NOTES} element={<NotesPage />} />
        <Route
          path={ROUTES.TERMSANDCONDITIONS}
          element={<TermsAndConditionsPage />}
        />
      </Routes>
    </>
  );
};

export default MainRouter;
