import { ReactElement, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import Gamification from "./components/Gamification/Gamification";
import { useGlobalState } from "./contexts/global";
import { useBeePing } from "./hooks/useBeePing";
import { useGamification } from "./hooks/useGamification";
import { useNotes } from "./hooks/useNotes";
import { usePoints } from "./hooks/usePoints";
import { usePreloadTalks } from "./hooks/usePreloadTalks";
import { usePrevLocation } from "./hooks/usePrevLocation";
import { useRouteProtection } from "./hooks/useRouteProtection";
import { useSessionData } from "./hooks/useSessionData";
import { useViewportHeight } from "./hooks/useViewportHeight";
import Agenda from "./pages/Agenda/Agenda";
import ClaimRewardPage from "./pages/ClaimReward/ClaimRevard";
import FullNotePage from "./pages/FullNote/FullNote";
import HomePage from "./pages/Home/Home";
import HowDoesItWork from "./pages/HowDoesItWork/HowDoesItWork";
import Intro from "./pages/Intro/Intro";
import NotesPage from "./pages/Notes/Notes";
import Profile from "./pages/Profile/Profile";
import ProfileCreation from "./pages/ProfileCreation/ProfileCreation";
import Spaces from "./pages/Spaces/Spaces";
import TACOnboardingPage from "./pages/TACOnboarding/TACOnboarding";
import TalkPage from "./pages/Talk/Talk";
import TermsAndConditionsPage from "./pages/TermsAndConditions/TermsAndConditions";
import Welcome1 from "./pages/Welcome1/Welcome1";
import Welcome2 from "./pages/Welcome2/Welcome2";
import Welcome3 from "./pages/Welcome3/Welcome3";
import Welcome4 from "./pages/Welcome4/Welcome4";
import { ROUTES } from "./utils/constants";

const MainRouter = (): ReactElement => {
  const { showGamification, sessions, points } = useGlobalState();
  const location = useLocation();
  const navigate = useNavigate();

  const { isBeeRunning } = useBeePing();

  const { filterRecentSessions } = useSessionData(isBeeRunning);

  useEffect(() => {
    if (sessions) {
      filterRecentSessions(sessions);
    }
  }, [sessions, filterRecentSessions]);

  const { calcActivity, calcSpacesActivity } = usePreloadTalks();

  useEffect(() => {
    if (isBeeRunning && sessions && sessions.size > 0) {
      calcActivity();
      calcSpacesActivity();
    }
  }, [isBeeRunning, sessions]);

  const { prevLocation } = usePrevLocation(location);

  useViewportHeight();

  usePoints();

  useNotes();

  useGamification();

  useRouteProtection(location, navigate);

  return (
    <>
      {showGamification ? <Gamification points={points} /> : null}
      <Routes>
        <Route path={ROUTES.APP} element={<Intro />} />
        <Route path={ROUTES.WELCOME1} element={<Welcome1 />} />
        <Route path={ROUTES.WELCOME2} element={<Welcome2 />} />
        <Route path={ROUTES.WELCOME3} element={<Welcome3 />} />
        <Route path={ROUTES.WELCOME4} element={<Welcome4 />} />
        <Route path={ROUTES.PROFILECREATION} element={<ProfileCreation />} />
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.HOMEWITHGAMIFICATION} element={<HomePage withGamification={true} />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.AGENDA} element={<Agenda />} />
        <Route path={ROUTES.SPACES} element={<Spaces />} />
        <Route path={ROUTES.HOWDOESITWORK} element={<HowDoesItWork toText={prevLocation ? prevLocation : undefined} />} />
        <Route path={ROUTES.CLAIMREWARD} element={<ClaimRewardPage />} />
        <Route path={`${ROUTES.TALKS}/:talkId`} element={<TalkPage toText={prevLocation} />} />
        <Route path={ROUTES.NOTES} element={<NotesPage />} />
        <Route path={`${ROUTES.NOTES}/:noteId`} element={<FullNotePage />} />
        <Route path={ROUTES.TACONBOARDING} element={<TACOnboardingPage />} />
        <Route path={ROUTES.TERMSANDCONDITIONS} element={<TermsAndConditionsPage />} />
      </Routes>
    </>
  );
};

export default MainRouter;
