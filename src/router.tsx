import { ReactElement, useCallback, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { CommentsWithIndex } from "@solarpunkltd/comment-system";
import { loadLatestComments } from "@solarpunkltd/comment-system-ui";
import { Wallet } from "ethers";

import Gamification from "./components/Gamification/Gamification";
import { NoteItemProps } from "./components/NoteItem/NoteItem";
import { useGlobalState } from "./contexts/global";
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
import { TalkComments } from "./types/talkComment";
import { getData, getFeedUpdate, getTopic } from "./utils/bee";
import {
  ADDRESS_HEX_LENGTH,
  CATEGORIES,
  DUMMY_STAMP,
  FIVE_MINUTES,
  MAX_COMMENTS_LOADED,
  MAX_SESSIONS_SHOWN,
  ROUTES,
  SELF_NOTE_TOPIC,
} from "./utils/constants";
import {
  findSlotStartIx,
  getPrivateKey,
  getSessionsByDay,
  getSigner,
  getWallet,
  isUserRegistered,
} from "./utils/helpers";

const MainRouter = (): ReactElement => {
  const {
    showGamification,
    setShowGamification,
    points,
    setPoints,
    username,
    sessions,
    setSessions,
    recentSessions,
    setRecentSessions,
    loadedTalks,
    setLoadedTalks,
    notes,
    setNotes,
    setTalkActivity,
    setSpacesActivity,
  } = useGlobalState();
  const [sessionsReference, setSessionsReference] = useState<string>("");
  const [isBeeRunning, setBeeRunning] = useState<boolean>(false);
  const [recentSessionIx, setRecentSessionIx] = useState<number>(0);
  const [time, setTime] = useState<number>(new Date().getTime());
  const [noteRawTopics, setNoteRawTopics] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
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

  const getPoints = async () => {
    try {
      if (isUserRegistered()) {
        fetch(process.env.BACKEND_API_URL + "/points/" + username).then(
          (resp) =>
            resp.text().then((data) => {
              setPoints(Number(data));
            })
        );
      }
    } catch (error) {
      console.log("error fetching points: ", error);
    }
  };

  useEffect(() => {
    checkBee();
    const interval = setInterval(() => {
      checkBee();
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

      data.set("spaces", spacesSessions);
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
    const interval = setInterval(async () => {
      setTime(new Date().getTime());
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
          // talkids include a "version" suffix
          const foundIx = loadedTalks.findIndex((talk) =>
            talk.talkId.includes(rawTalkTopic)
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
        talkIds.push(rawTalkTopic);
      }

      await Promise.allSettled(commentPromises).then((results) => {
        results.forEach((result, i) => {
          if (result.status === "fulfilled") {
            preLoadedTalks.push({
              talkId: talkIds[i],
              comments: result.value.comments,
              nextIndex: result.value.nextIndex,
            });
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

  const calcActivity = async () => {
    if (loadedTalks) {
      const tmpActiveVisitors = new Map<string, number>();
      for (let i = 0; i < recentSessions.length; i++) {
        const foundIx = loadedTalks.findIndex((talk) =>
          talk.talkId.includes(recentSessions[i].id)
        );
        if (foundIx > -1) {
          tmpActiveVisitors.set(
            recentSessions[i].id,
            loadedTalks[foundIx].nextIndex
          );
        }
      }
      setTalkActivity(tmpActiveVisitors);
    }
  };

  const calcSapcesActivity = async () => {
    const spacesSessions = getSessionsByDay(sessions, "spaces");
    const spacesPromises: Promise<CommentsWithIndex>[] = [];
    const stamp = process.env.STAMP || DUMMY_STAMP;
    try {
      for (let i = 0; i < spacesSessions.length; i++) {
        const rawTalkTopic = getTopic(spacesSessions[i].id, true);
        const wallet = getWallet(rawTalkTopic);
        const signer = getSigner(wallet);
        spacesPromises.push(
          loadLatestComments(
            stamp,
            rawTalkTopic,
            signer,
            process.env.BEE_API_URL,
            MAX_COMMENTS_LOADED
          )
        );
      }

      const tmpActivity = new Map<string, number>();
      await Promise.allSettled(spacesPromises).then((results) => {
        results.forEach((result, i) => {
          if (result.status === "fulfilled") {
            tmpActivity.set(spacesSessions[i].id, result.value.nextIndex);
          } else {
            console.log(`fetching user count of talks error: `, result.reason);
          }
        });
      });
      setSpacesActivity(tmpActivity);
    } catch (error) {
      console.log("fetching user count of talks error: ", error);
    }
  };

  useEffect(() => {
    calcActivity();
  }, [loadedTalks]);

  useEffect(() => {
    calcSapcesActivity();
  }, [recentSessions]);

  const fetchNotes = async () => {
    const privKey = getPrivateKey();
    if (!privKey) {
      console.log("private key not found - cannot fetch notes");
      return;
    }

    const wallet = new Wallet(privKey);
    const feedPromises: Promise<string>[] = [];
    for (let i = 0; i < noteRawTopics.length; i++) {
      const rawTopic = noteRawTopics[i];
      feedPromises.push(getFeedUpdate(wallet.address, rawTopic));
    }

    const dataRefPromises: Promise<string>[] = [];
    await Promise.allSettled(feedPromises).then((results) => {
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          dataRefPromises.push(getData(result.value));
        } else {
          console.log(`fetching note ref error: `, result.reason);
        }
      });
    });

    const notesArray: string[] = [];
    await Promise.allSettled(dataRefPromises).then((results) => {
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          notesArray.push(result.value);
        } else {
          console.log(`fetching note data error: `, result.reason);
        }
      });
    });

    const tmpNotes: NoteItemProps[] = [...notes];
    for (let i = 0; i < notesArray.length; i++) {
      let note: NoteItemProps | undefined = undefined;
      try {
        note = JSON.parse(notesArray[i]) as NoteItemProps;
      } catch (error) {
        console.log(`error parsing notes[${i}]:\n ${error}`);
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

  useEffect(() => {
    const privKey = localStorage.getItem("privKey");
    const noRedirectedPaths = [
      ROUTES.WELCOME1,
      ROUTES.WELCOME2,
      ROUTES.WELCOME3,
      ROUTES.WELCOME4,
      ROUTES.TACONBOARDING,
      ROUTES.PROFILECREATION,
    ];
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
        <Route
          path={ROUTES.HOMEWITHGAMIFICATION}
          element={<HomePage withGamification={true} />}
        />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.AGENDA} element={<Agenda />} />
        <Route path={ROUTES.SPACES} element={<Spaces />} />
        <Route
          path={ROUTES.HOWDOESITWORK}
          element={
            <HowDoesItWork toText={prevLocation ? prevLocation : undefined} />
          }
        />
        <Route path={ROUTES.CLAIMREWARD} element={<ClaimRewardPage />} />
        <Route
          path={`${ROUTES.TALKS}/:talkId`}
          element={<TalkPage toText={prevLocation} />}
        />
        <Route path={ROUTES.CONTENTFILTER} element={<ContentFilter />} />
        <Route path={ROUTES.NOTES} element={<NotesPage />} />
        <Route path={`${ROUTES.NOTES}/:noteId`} element={<FullNotePage />} />
        <Route path={ROUTES.TACONBOARDING} element={<TACOnboardingPage />} />
        <Route path={ROUTES.STAYUPDATED} element={<StayUpdated />} />
        <Route
          path={ROUTES.TERMSANDCONDITIONS}
          element={<TermsAndConditionsPage />}
        />
      </Routes>
    </>
  );
};

export default MainRouter;
