import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { loadLatestComments } from "@solarpunkltd/comment-system-ui";
import { CommentsWithIndex } from "@solarpunkltd/comment-system";
import { Wallet } from "ethers";
import { useGlobalState } from "./GlobalStateContext";
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
import TalkPage from "./pages/TalkPage/TalkPage";
import { Session } from "./types/session";
import HowDoesItWork from "./pages/HowDoesItWork/HowDoesItWork";
import ClaimRewardPage from "./pages/ClaimRewardPage/ClaimRevardPage";
import ContentFilterPage from "./pages/ContentFilterPage/ContentFilterPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage/TermsAndConditionsPage";
import NotesPage from "./pages/NotesPage/NotesPage";
import FullNotePage from "./pages/FullNotePage/FullNotePage";
import TACOnboardingPage from "./pages/TACOnboardingPage/TACOnboardingPage";
import StayUpdatedPage from "./pages/StayUpdatedPage/StayUpdatedPage";
import { TalkComments } from "./types/talkComment";
import { getFeedUpdate, getData, getTopic } from "./utils/bee";
import { NoteItemProps } from "./components/NoteItem/NoteItem";
import {
  ROUTES,
  FIVE_MINUTES,
  ADDRESS_HEX_LENGTH,
  DUMMY_STAMP,
  MOCK_START_TIME,
  MAX_COMMENTS_LOADED,
  MAX_SESSIONS_SHOWN,
  SELF_NOTE_TOPIC,
} from "./utils/constants";
import {
  getSessionsByDay,
  getSigner,
  getWallet,
  isEmpty,
  findSlotStartIx,
} from "./utils/helpers";

const MainRouter = (): ReactElement => {
  const {
    showGamification,
    setShowGamification,
    points,
    sessions,
    setSessions,
    recentSessions,
    setRecentSessions,
    loadedTalks,
    setLoadedTalks,
    notes,
    setNotes,
  } = useGlobalState();
  const [sessionsReference, setSessionsReference] = useState<string>("");
  const [isBeeRunning, setBeeRunning] = useState<boolean>(false);
  const [recentSessionIx, setRecentSessionIx] = useState<number>(0);
  const [time, setTime] = useState<number>(MOCK_START_TIME.getTime());
  const [noteRawTopics, setNoteRawTopics] = useState<string[]>([]);
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState<string | null>(null);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

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

  const checkBee = async () => {
    try {
      await fetch(
        process.env.BEE_API_URL + "/bytes/" + process.env.HEALTH_CHECK_DATA_REF
      );
      if (!isBeeRunning) {
        setBeeRunning(true);
        console.log("Bee is running");
      }
    } catch (error) {
      if (isBeeRunning) {
        setBeeRunning(false);
        console.log("Bee stopped running, error: ", error);
      }
    }
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
      const rawFeedTopicSession = "sessions";
      const ref = await getFeedUpdate(
        process.env.FEED_OWNER_ADDRESS as string,
        rawFeedTopicSession
      );
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
      let dataStr;
      try {
        dataStr = JSON.parse(await getData(sessionsReference));
      } catch (error) {
        console.log(
          `error parsing session, ref ${sessionsReference}:\n ${error}`
        );
        return;
      }
      const data = new Map<string, Session[]>(Object.entries(dataStr));
      if (data.size !== 0) {
        console.log("session data updated");
        setSessions(() => data);
      } else {
        console.log("session data empty");
      }
    }
  }, [sessionsReference]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    } else {
      setShowGamification(true);
    }
  }, [points]);

  // the uploaded sessions are already sorted by time and day
  // find the first session that starts after the current time
  const filterRecentSessions = () => {
    const sessionsByDay = getSessionsByDay(
      sessions,
      MOCK_START_TIME.toDateString() // shall be time
    );
    if (sessionsByDay.length != 0) {
      const mostRecentSessions = new Array<Session>(MAX_SESSIONS_SHOWN);
      let firstSessionIx = findSlotStartIx(
        recentSessionIx,
        sessionsByDay,
        time
      );
      firstSessionIx =
        firstSessionIx > MAX_SESSIONS_SHOWN - 1
          ? firstSessionIx
          : MAX_SESSIONS_SHOWN - 1;

      for (
        let i = 0;
        i < MAX_SESSIONS_SHOWN && 0 < sessionsByDay.length - firstSessionIx - i;
        i++
      ) {
        const recentIx = firstSessionIx - i;
        mostRecentSessions[i] = sessionsByDay[recentIx];
      }
      setRecentSessionIx(firstSessionIx);
      setRecentSessions(mostRecentSessions);
    }
  };

  useEffect(() => {
    // TODO: what shall be the update time ?
    const interval = setInterval(async () => {
      // TODO: remove this: increase current time by 10 minutes to see the change in recent sessions
      setTime((time) => new Date(time + FIVE_MINUTES).getTime());
    }, FIVE_MINUTES);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterRecentSessions();
  }, [sessions, time]);

  const preLoadTalks = async () => {
    try {
      const stamp = process.env.STAMP || DUMMY_STAMP;
      const preLoadedTalks: TalkComments[] = [];
      const commentPromises: Promise<CommentsWithIndex>[] = [];
      const talkIds: string[] = [];
      for (let i = 0; i < recentSessions.length; i++) {
        const sessionId = recentSessions[i].id;
        const rawTalkTopic = getTopic(sessionId, true);
        const wallet = getWallet(rawTalkTopic);
        const signer = getSigner(wallet);
        // only load the talks that are not already loaded
        if (loadedTalks) {
          const foundIx = loadedTalks.findIndex(
            (talk) => talk.talkId === sessionId
          );
          if (foundIx > -1) {
            preLoadedTalks.push(loadedTalks[foundIx]);
            continue;
          }
        }
        commentPromises.push(
          loadLatestComments(
            stamp,
            rawTalkTopic,
            signer,
            process.env.BEE_API_URL,
            MAX_COMMENTS_LOADED
          )
        );
        talkIds.push(sessionId);
      }

      await Promise.allSettled(commentPromises).then((results) => {
        results.forEach((result, i) => {
          if (result.status === "fulfilled") {
            if (result.value && !isEmpty(result.value)) {
              preLoadedTalks.push({
                talkId: talkIds[i],
                comments: result.value.comments,
                nextIndex: result.value.nextIndex,
              });
            }
          } else {
            console.log(`preloading talks error: `, result.reason);
          }
        });
      });

      setLoadedTalks(preLoadedTalks.length > 0 ? preLoadedTalks : undefined);
    } catch (error) {
      console.log("preloading talks error: ", error);
    }
  };

  useEffect(() => {
    preLoadTalks();
  }, [recentSessions]);

  // TODO: batch promises just like preloaded talks
  const fetchNotes = async () => {
    const privKey = localStorage.getItem("privKey");
    if (!privKey) {
      console.log("private key not found - cannot fetch notes");
      return;
    }

    const wallet = new Wallet(privKey);
    for (let i = 0; i < noteRawTopics.length; i++) {
      const rawTopic = noteRawTopics[i];
      const dataRef = await getFeedUpdate(wallet.address, rawTopic);
      let note: NoteItemProps | undefined = undefined;
      try {
        note = JSON.parse(await getData(dataRef)) as NoteItemProps;
      } catch (error) {
        console.log(`error parsing note, ref ${dataRef}:\n ${error}`);
        continue;
      }
      const found = notes.find((n) => n.id === note.id);
      if (!found && note !== undefined) {
        setNotes((notes) => [...notes, note]);
      }
    }
    console.log("self notes updated");
  };

  useEffect(() => {
    const selfNoteTopicsStr = localStorage.getItem(SELF_NOTE_TOPIC);
    if (selfNoteTopicsStr) {
      const tmpTopics = selfNoteTopicsStr.split(",");
      setNoteRawTopics(
        tmpTopics.filter((t) => t.length === ADDRESS_HEX_LENGTH)
      );
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [noteRawTopics]);

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
        <Route path={ROUTES.HOME} element={<HomePage isLoaded={false} />} />
        <Route
          path={ROUTES.HOMEDEBUGLESS}
          element={<HomePage isLoaded={false} debugless={true} />}
        />
        <Route path={ROUTES.DEVCONLOUNGE} element={<DevconLounge />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.AGENDA} element={<Agenda />} />
        <Route path={ROUTES.SPACES} element={<SpacesPage />} />
        <Route path={ROUTES.HOWDOESITWORK} element={<HowDoesItWork />} />
        <Route path={ROUTES.CLAIMREWARD} element={<ClaimRewardPage />} />
        <Route
          path={`${ROUTES.TALKS}/:talkId`}
          element={<TalkPage toText={prevLocation} />}
        />
        <Route path={ROUTES.CONTENTFILTER} element={<ContentFilterPage />} />
        <Route path={ROUTES.NOTES} element={<NotesPage />} />
        <Route path={`${ROUTES.NOTES}/:noteId`} element={<FullNotePage />} />
        <Route path={ROUTES.TACONBOARDING} element={<TACOnboardingPage />} />
        <Route path={ROUTES.STAYUPDATED} element={<StayUpdatedPage />} />
        <Route
          path={ROUTES.TERMSANDCONDITIONS}
          element={<TermsAndConditionsPage />}
        />
      </Routes>
    </>
  );
};

export default MainRouter;
