import { Wallet } from "ethers";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import Gamification from "./components/Gamification/Gamification";
import { NoteItemProps } from "./components/NoteItem/NoteItem";
import { useGlobalState } from "./contexts/global";
// import { useCalcTalkActivity } from "./hooks/useCalcTalkActivity";
// import { useCalcSpacesActivity } from "./hooks/useCalcSpacesActivity";
import Agenda from "./pages/Agenda/Agenda";
import ClaimRewardPage from "./pages/ClaimReward/ClaimRevard";
import ContentFilter from "./pages/ContentFilter/ContentFilter";
import FullNotePage from "./pages/FullNote/FullNote";
import HomePage from "./pages/Home/Home";
import HowDoesItWork from "./pages/HowDoesItWork/HowDoesItWork";
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
import Welcome4 from "./pages/Welcome4/Welcome4";
import { Session } from "./types/session";
import { getFeedUpdate } from "./utils/bee";
import {
  ADDRESS_HEX_LENGTH,
  CATEGORIES,
  FIVE_MINUTES,
  MAX_SESSIONS_SHOWN,
  RAW_FEED_TOPIC_SESSIONS,
  ROUTES,
  SELF_NOTE_TOPIC,
  SPACES_KEY,
  TWO_SECONDS,
} from "./utils/constants";
import { findSlotStartIx, getLocalPrivateKey, getSessionsByDay, isUserRegistered } from "./utils/helpers";
import { usePreloadTalks } from "./hooks/usePreloadTalks";
import { CommentSettings } from "@solarpunkltd/swarm-comment-js";

// TODO: refactor mainrouter, everything is dumped here
const MainRouter = (): ReactElement => {
  const { showGamification, setShowGamification, points, setPoints, username, sessions, setSessions, setRecentSessions, notes, setNotes } =
    useGlobalState();
  const [isBeeRunning, setBeeRunning] = useState<boolean>(false);
  const [recentSessionIx, setRecentSessionIx] = useState<number>(0);
  const [time, setTime] = useState<number>(new Date().getTime());
  const [noteRawTopics, setNoteRawTopics] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [prevLocation, setPrevLocation] = useState<string | null>(null);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

  const beeUrl = process.env.BEE_API_URL;

  const setVhVariable = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  useEffect(() => {
    return () => {
      setPrevLocation(location.pathname);
    };
  }, [location]);

  useEffect(() => {
    setVhVariable();
    window.addEventListener("resize", setVhVariable);
    return () => {
      window.removeEventListener("resize", setVhVariable);
    };
  }, []);
  // TODO: useNetworkStatus from swarm-comment-react-example
  const checkBee = async (url: string) => {
    try {
      await fetch(url + "/bytes/" + process.env.HEALTH_CHECK_DATA_REF);
      if (!isBeeRunning) {
        setBeeRunning(true);
        console.debug("Bee is running");
      }
    } catch (error) {
      if (isBeeRunning) {
        setBeeRunning(false);
        console.error("Bee stopped running, error: ", error);
      }
    }
  };

  const getPoints = async () => {
    try {
      if (isUserRegistered()) {
        fetch(process.env.BACKEND_API_URL + "/points/" + username).then((resp) =>
          resp.text().then((data) => {
            setPoints(Number(data));
          })
        );
      }
    } catch (error) {
      console.error("error fetching points: ", error);
    }
  };

  useEffect(() => {
    if (!beeUrl) {
      console.error("BEE API URL is not configured.");
      return;
    }

    checkBee(beeUrl);
    const interval = setInterval(() => {
      checkBee(beeUrl);
    }, FIVE_MINUTES);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getPoints();
    const interval = setInterval(() => {
      getPoints();
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [username]);

  const fetchFeedUpdate = useCallback(async () => {
    if (isBeeRunning) {
      // TODO: unnecessary payload.tostring() then back to json
      const dataStr = await getFeedUpdate(process.env.FEED_OWNER_ADDRESS as string, RAW_FEED_TOPIC_SESSIONS);
      const data = new Map<string, Session[]>(Object.entries(JSON.parse(dataStr)));

      const spacesSessions: Session[] = [];
      for (let i = 0; i < CATEGORIES.length; i++) {
        const cat = CATEGORIES[i];
        spacesSessions.push({
          id: cat,
          sourceId: cat,
          title: cat,
          track: cat,
          slot_start: new Date().toLocaleString(),
          slot_end: new Date().toLocaleString(),
          slot_roomId: cat,
        });
      }

      data.set(SPACES_KEY, spacesSessions);
      if (data.size !== 0) {
        console.debug("session data updated");
        setSessions(() => data);
      } else {
        console.debug("session data empty");
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

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    } else {
      if (points === 1 || points === 5 || points === 10) {
        setShowGamification(true);
      }
    }
  }, [points]);

  // the uploaded sessions are already sorted by time and day
  // find the first session that starts after the current time
  const filterRecentSessions = () => {
    const day = "all";
    const sessionsByDay = getSessionsByDay(sessions, day);
    if (sessionsByDay.length != 0) {
      const mostRecentSessions = new Array<Session>(MAX_SESSIONS_SHOWN);
      let firstSessionIx = findSlotStartIx(recentSessionIx, sessionsByDay, time);
      firstSessionIx = firstSessionIx > MAX_SESSIONS_SHOWN - 1 ? firstSessionIx : MAX_SESSIONS_SHOWN - 1;

      for (let i = 0; i < MAX_SESSIONS_SHOWN && 0 < sessionsByDay.length - firstSessionIx - i; i++) {
        const recentIx = firstSessionIx - i;
        mostRecentSessions[i] = sessionsByDay[recentIx];
      }
      setRecentSessionIx(firstSessionIx);
      setRecentSessions(mostRecentSessions);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      setTime(new Date().getTime());
    }, FIVE_MINUTES);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterRecentSessions();
  }, [sessions, time]);

  const fetchNotes = async () => {
    if (!privKey) {
      console.error("private key not found - cannot fetch notes");
      return;
    }

    const wallet = new Wallet(privKey); // TODO: remove wallet and use PrivateKey everywhere
    const feedPromises: Promise<string>[] = [];
    for (let i = 0; i < noteRawTopics.length; i++) {
      const rawTopic = noteRawTopics[i];
      feedPromises.push(getFeedUpdate(wallet.address, rawTopic));
    }

    const notesArray: string[] = [];
    await Promise.allSettled(feedPromises).then((results) => {
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          notesArray.push(result.value);
        } else {
          console.error(`fetching note data error: `, result.reason);
        }
      });
    });

    const tmpNotes: NoteItemProps[] = [...notes];
    for (let i = 0; i < notesArray.length; i++) {
      let note: NoteItemProps | undefined = undefined;
      try {
        note = JSON.parse(notesArray[i]) as NoteItemProps;
      } catch (error) {
        console.error(`error parsing notes[${i}]:\n ${error}`);
        continue;
      }
      const found = notes.find((n) => n.id === note.id);
      if (!found && note !== undefined) {
        tmpNotes.push(note);
      }
    }
    tmpNotes.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    });
    setNotes(tmpNotes);

    console.debug("self notes updated");
  };

  useEffect(() => {
    const selfNoteTopicsStr = localStorage.getItem(SELF_NOTE_TOPIC);
    if (selfNoteTopicsStr) {
      const tmpTopics = selfNoteTopicsStr.split(",");
      setNoteRawTopics(tmpTopics.filter((t) => t.length === ADDRESS_HEX_LENGTH));
    }
  }, []);

  const privKey = getLocalPrivateKey();

  // todo: use global beeUrl, signer, stamp
  // todo: privkey probably not set here?
  const defaultCommentConfig: CommentSettings = {
    user: {
      privateKey: privKey,
      nickname: username,
    },
    infra: {
      beeUrl: beeUrl || "",
      stamp: process.env.STAMP,
      topic: "unknown",
      pollInterval: TWO_SECONDS,
    },
  };

  const { preLoadTalks } = usePreloadTalks(defaultCommentConfig);

  useEffect(() => {
    preLoadTalks();
  }, [preLoadTalks]);

  // const { calcTalkActivity } = useCalcTalkActivity(defaultCommentConfig);
  // const { calcSpacesActivity } = useCalcSpacesActivity(defaultCommentConfig);

  // useEffect(() => {
  //   calcTalkActivity();
  // // }, [calcTalkActivity]);

  // useEffect(() => {
  //   calcSpacesActivity();
  // }, [calcSpacesActivity]);

  useEffect(() => {
    fetchNotes();
  }, [noteRawTopics]);

  useEffect(() => {
    const noRedirectedPaths = [ROUTES.WELCOME1, ROUTES.WELCOME2, ROUTES.WELCOME3, ROUTES.WELCOME4, ROUTES.TACONBOARDING, ROUTES.PROFILECREATION];
    if (!privKey && !noRedirectedPaths.includes(location.pathname as ROUTES)) {
      navigate(ROUTES.APP);
    }
  }, [navigate]);

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
        <Route path={ROUTES.CONTENTFILTER} element={<ContentFilter />} />
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
