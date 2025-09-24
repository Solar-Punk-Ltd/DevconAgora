import React, { createContext, ReactNode, useContext, useState } from "react";

import { NoteItemProps } from "../components/NoteItem/NoteItem";
import { Session } from "../types/session";
import { TalkComments } from "../types/talkComment";

import { Space } from "@/types/space";

interface GlobalState {
  sessions: Map<string, Session[]>;
  setSessions: React.Dispatch<React.SetStateAction<Map<string, Session[]>>>;
  spaces: Space[];
  setSpaces: React.Dispatch<React.SetStateAction<Space[]>>;
  recentSessions: Session[];
  setRecentSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  loadedTalks: TalkComments[] | undefined;
  setLoadedTalks: React.Dispatch<React.SetStateAction<TalkComments[] | undefined>>;
  loadedSpaces: TalkComments[] | undefined;
  setLoadedSpaces: React.Dispatch<React.SetStateAction<TalkComments[] | undefined>>;
  isTermsAndConditionsAccepted: boolean;
  setIsTermsAndConditionsAccepted: React.Dispatch<React.SetStateAction<boolean>>;
  notes: NoteItemProps[];
  setNotes: React.Dispatch<React.SetStateAction<NoteItemProps[]>>;
  talkActivity: Map<string, number>;
  setTalkActivity: React.Dispatch<React.SetStateAction<Map<string, number>>>;
  spacesActivity: Map<string, number>;
  setSpacesActivity: React.Dispatch<React.SetStateAction<Map<string, number>>>;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

interface GlobalStateProviderProps {
  children: ReactNode;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
  const [isTermsAndConditionsAccepted, setIsTermsAndConditionsAccepted] = useState<boolean>(false);

  const [sessions, setSessions] = useState<Map<string, Session[]>>(new Map<string, Session[]>());

  const [spaces, setSpaces] = useState<Space[]>([]);

  const [recentSessions, setRecentSessions] = useState<Session[]>([]);

  const [loadedTalks, setLoadedTalks] = useState<TalkComments[] | undefined>();

  const [loadedSpaces, setLoadedSpaces] = useState<TalkComments[] | undefined>();

  const [notes, setNotes] = useState<NoteItemProps[]>([]);

  const [talkActivity, setTalkActivity] = useState<Map<string, number>>(new Map<string, number>());

  const [spacesActivity, setSpacesActivity] = useState<Map<string, number>>(new Map<string, number>());

  return (
    <GlobalStateContext.Provider
      value={{
        sessions,
        setSessions,
        recentSessions,
        setRecentSessions,
        loadedTalks,
        setLoadedTalks,
        loadedSpaces,
        setLoadedSpaces,
        isTermsAndConditionsAccepted,
        setIsTermsAndConditionsAccepted,
        notes,
        setNotes,
        talkActivity,
        setTalkActivity,
        spacesActivity,
        setSpacesActivity,
        spaces,
        setSpaces,
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
