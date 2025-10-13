import { ReactElement, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { useGlobalState } from "./contexts/global";
import { useBeePing } from "./hooks/useBeePing";
import { useNotes } from "./hooks/useNotes";
import { usePreloadRecentSessions, usePreloadSpacesSessions } from "./hooks/usePreloadTalks";
import { usePrevLocation } from "./hooks/usePrevLocation";
import { useRouteProtection } from "./hooks/useRouteProtection";
import { useSessionData } from "./hooks/useSessionData";
import { useViewportHeight } from "./hooks/useViewportHeight";
import Agenda from "./pages/Agenda/Agenda";
import FullNotePage from "./pages/FullNote/FullNote";
import HomePage from "./pages/Home/Home";
import Intro from "./pages/Intro/Intro";
import NotesPage from "./pages/Notes/Notes";
import Profile from "./pages/Profile/Profile";
import ProfileCreation from "./pages/ProfileCreation/ProfileCreation";
import Spaces from "./pages/Spaces/Spaces";
import StayUpdated from "./pages/StayUpdated/StayUpdated";
import TACOnboardingPage from "./pages/TACOnboarding/TACOnboarding";
import TalkPage from "./pages/Talk/Talk";
import TermsAndConditionsPage from "./pages/TermsAndConditions/TermsAndConditions";
import Welcome1 from "./pages/Welcome1/Welcome1";
import Welcome2 from "./pages/Welcome2/Welcome2";
import Welcome3 from "./pages/Welcome3/Welcome3";
import { ROUTES } from "./utils/constants";

const MainRouter = (): ReactElement => {
  const { sessions, recentSessions } = useGlobalState();
  const location = useLocation();
  const navigate = useNavigate();

  const { isBeeRunning } = useBeePing();

  const { filterRecentSessions } = useSessionData(isBeeRunning);

  useEffect(() => {
    if (sessions) {
      filterRecentSessions(sessions);
    }
  }, [sessions, filterRecentSessions]);
  // not preloading reactions state, it can be loaded on demand
  const { preloadSpacesSessions } = usePreloadSpacesSessions();
  const { preloadRecentSessions } = usePreloadRecentSessions();

  useEffect(() => {
    if (isBeeRunning && sessions && sessions.size > 0) {
      preloadSpacesSessions();
    }
  }, [isBeeRunning, sessions, preloadSpacesSessions]);

  useEffect(() => {
    if (recentSessions && recentSessions.length > 0) {
      preloadRecentSessions();
    }
  }, [recentSessions, preloadRecentSessions]);

  const { prevLocation } = usePrevLocation(location);

  useViewportHeight();

  useNotes();

  useRouteProtection(location, navigate);

  return (
    <>
      <Routes>
        <Route path={ROUTES.APP} element={<Intro />} />
        <Route path={ROUTES.WELCOME1} element={<Welcome1 />} />
        <Route path={ROUTES.WELCOME2} element={<Welcome2 />} />
        <Route path={ROUTES.WELCOME3} element={<Welcome3 />} />
        <Route path={ROUTES.PROFILECREATION} element={<ProfileCreation />} />
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.HOMEWITHGAMIFICATION} element={<HomePage />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.AGENDA} element={<Agenda />} />
        <Route path={ROUTES.SPACES} element={<Spaces />} />
        <Route path={`${ROUTES.TALKS}/:talkId`} element={<TalkPage toText={prevLocation} />} />
        <Route path={ROUTES.NOTES} element={<NotesPage />} />
        <Route path={`${ROUTES.NOTES}/:noteId`} element={<FullNotePage />} />
        <Route path={ROUTES.TACONBOARDING} element={<TACOnboardingPage />} />
        <Route path={ROUTES.STAYUPDATED} element={<StayUpdated />} />
        <Route path={ROUTES.TERMSANDCONDITIONS} element={<TermsAndConditionsPage />} />
      </Routes>
    </>
  );
};

export default MainRouter;
