import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Session } from "./types/session";
import { TalkComments } from "./types/talkComment";
import { NoteItemProps } from "./components/NoteItem/NoteItem";
import { createMonogram } from "./utils/helpers";
import { RoomWithUserCounts } from "./types/room";
import { CATEGORIES, CATEGORY_NAMES_TO_ID_MAP } from "./utils/constants";

interface GlobalState {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  monogram: string;
  setMonogram: React.Dispatch<React.SetStateAction<string>>;
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  showGamification: boolean;
  setShowGamification: React.Dispatch<React.SetStateAction<boolean>>;
  sessions: Map<string, Session[]>;
  setSessions: React.Dispatch<React.SetStateAction<Map<string, Session[]>>>;
  recentSessions: Session[];
  setRecentSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  loadedTalks: TalkComments[] | undefined;
  setLoadedTalks: React.Dispatch<
    React.SetStateAction<TalkComments[] | undefined>
  >;
  isContentFilterEnabled: boolean;
  setIsContentFilterEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isTermsAndConditionsAccepted: boolean;
  setIsTermsAndConditionsAccepted: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  notes: NoteItemProps[];
  setNotes: React.Dispatch<React.SetStateAction<NoteItemProps[]>>;
  talkActivity: Map<string, number>;
  setTalkActivity: React.Dispatch<React.SetStateAction<Map<string, number>>>;
  orderedList: RoomWithUserCounts[];
  setOrderedList: React.Dispatch<React.SetStateAction<RoomWithUserCounts[]>>;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

interface GlobalStateProviderProps {
  children: ReactNode;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({
  children,
}) => {
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem("username") || "";
  });
  const [monogram, setMonogram] = useState<string>(() => {
    return createMonogram(localStorage.getItem("username") || "");
  });

  const [points, setPoints] = useState<number>(() => {
    const storedPoints = localStorage.getItem("points");
    return storedPoints ? parseInt(storedPoints, 10) : 0;
  });

  const [isContentFilterEnabled, setIsContentFilterEnabled] = useState<boolean>(
    () => {
      const storedValue = localStorage.getItem("isContentFilterEnabled");
      return storedValue === null ? true : storedValue === "true";
    }
  );

  const [showGamification, setShowGamification] = useState<boolean>(false);
  const [isTermsAndConditionsAccepted, setIsTermsAndConditionsAccepted] =
    useState<boolean>(false);

  const [sessions, setSessions] = useState<Map<string, Session[]>>(
    new Map<string, Session[]>()
  );

  const [recentSessions, setRecentSessions] = useState<Session[]>([]);

  const [loadedTalks, setLoadedTalks] = useState<TalkComments[] | undefined>();

  const [notes, setNotes] = useState<NoteItemProps[]>([]);

  const [talkActivity, setTalkActivity] = useState<Map<string, number>>(
    new Map<string, number>()
  );

  // List of room, ordered by user count
  const [orderedList, setOrderedList] = useState<RoomWithUserCounts[]>(
    CATEGORIES.map((catName) => ({
      topic: CATEGORY_NAMES_TO_ID_MAP.get(catName),
      url: "null",
      gateway: "",
      userCount: undefined,
    }))
  );

  useEffect(() => {
    localStorage.setItem("username", username);
    setMonogram(createMonogram(username));
  }, [username]);

  useEffect(() => {
    localStorage.setItem("points", points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem(
      "isContentFilterEnabled",
      isContentFilterEnabled.toString()
    );
  }, [isContentFilterEnabled]);

  useEffect(() => {
    if (!username) {
      try {
        fetch(process.env.BACKEND_API_URL + "/username/" + username).then(
          (resp) =>
            resp.text().then((data) => {
              setUsername(data);
              setMonogram(createMonogram(data));
            })
        );
      } catch (err) {
        console.log(`error fetching username "${username}" :`, err);
      }
    }
  }, []);

  return (
    <GlobalStateContext.Provider
      value={{
        username,
        setUsername,
        monogram,
        setMonogram,
        points,
        setPoints,
        showGamification,
        setShowGamification,
        sessions,
        setSessions,
        recentSessions,
        setRecentSessions,
        loadedTalks,
        setLoadedTalks,
        isContentFilterEnabled,
        setIsContentFilterEnabled,
        isTermsAndConditionsAccepted,
        setIsTermsAndConditionsAccepted,
        notes,
        setNotes,
        talkActivity,
        setTalkActivity,
        orderedList,
        setOrderedList
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): GlobalState => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
