import { FeedIndex } from "@ethersphere/bee-js";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { NoteItemProps } from "../components/NoteItem/NoteItem";
import { Session } from "../types/session";
import { TalkComments } from "../types/talkComment";
import { createMonogram } from "../utils/helpers";

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
  setLoadedTalks: React.Dispatch<React.SetStateAction<TalkComments[] | undefined>>;
  isContentFilterEnabled: boolean;
  setIsContentFilterEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isTermsAndConditionsAccepted: boolean;
  setIsTermsAndConditionsAccepted: React.Dispatch<React.SetStateAction<boolean>>;
  notes: NoteItemProps[];
  setNotes: React.Dispatch<React.SetStateAction<NoteItemProps[]>>;
  talkActivity: Map<string, FeedIndex>;
  setTalkActivity: React.Dispatch<React.SetStateAction<Map<string, FeedIndex>>>;
  spacesActivity: Map<string, FeedIndex>;
  setSpacesActivity: React.Dispatch<React.SetStateAction<Map<string, FeedIndex>>>;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

interface GlobalStateProviderProps {
  children: ReactNode;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
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

  const [isContentFilterEnabled, setIsContentFilterEnabled] = useState<boolean>(() => {
    const storedValue = localStorage.getItem("isContentFilterEnabled");
    return storedValue === null ? true : storedValue === "true";
  });

  const [showGamification, setShowGamification] = useState<boolean>(false);
  const [isTermsAndConditionsAccepted, setIsTermsAndConditionsAccepted] = useState<boolean>(false);

  const [sessions, setSessions] = useState<Map<string, Session[]>>(new Map<string, Session[]>());

  const [recentSessions, setRecentSessions] = useState<Session[]>([]);

  const [loadedTalks, setLoadedTalks] = useState<TalkComments[] | undefined>();

  const [notes, setNotes] = useState<NoteItemProps[]>([]);

  const [talkActivity, setTalkActivity] = useState<Map<string, FeedIndex>>(new Map<string, FeedIndex>());

  const [spacesActivity, setSpacesActivity] = useState<Map<string, FeedIndex>>(new Map<string, FeedIndex>());

  useEffect(() => {
    localStorage.setItem("username", username);
    setMonogram(createMonogram(username));
  }, [username]);

  useEffect(() => {
    localStorage.setItem("points", points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem("isContentFilterEnabled", isContentFilterEnabled.toString());
  }, [isContentFilterEnabled]);

  useEffect(() => {
    if (!username) {
      try {
        fetch(process.env.BACKEND_API_URL + "/username/" + username).then((resp) =>
          resp.text().then((data) => {
            setUsername(data);
            setMonogram(createMonogram(data));
          })
        );
      } catch (err) {
        console.error(`error fetching username "${username}" :`, err);
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
        spacesActivity,
        setSpacesActivity,
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
