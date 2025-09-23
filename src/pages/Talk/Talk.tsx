import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";
import TalkItem from "../../components/TalkItem/TalkItem";
import { useGlobalState } from "../../contexts/global";
import { Session } from "../../types/session";
import { Space } from "../../types/space";
import { DATE_TO_DEVCON_DAY, ROUTES } from "../../utils/constants";

import "./Talk.scss";
import { getSessionsByDay } from "@/utils/session";

interface TalkPageProps {
  toText: string | null;
}

const Talk: React.FC<TalkPageProps> = ({ toText }) => {
  const { sessions, spaces } = useGlobalState();
  const { talkId } = useParams();
  const [session, setSession] = useState<Session | Space | null>(null);
  const [isSpacesTalk, setIsSpacesTalk] = useState<boolean>(false);
  // in case a reload the path is the talk id, choose AGENDA instead
  const toTextFixed = toText?.startsWith(ROUTES.TALKS) ? ROUTES.AGENDA : toText;

  const findSessionId = (
    id: string
  ): {
    isSpaceSession: boolean;
    talk: Session | Space;
  } | null => {
    for (let i = 0; i < sessions.size; i++) {
      const sessionsByDay = getSessionsByDay(sessions, Array.from(DATE_TO_DEVCON_DAY.keys())[i]);
      const daySession = sessionsByDay.find((s) => s.id === id);
      if (daySession) {
        return {
          isSpaceSession: false,
          talk: daySession,
        };
      }

      const space = spaces.find((s) => s.id === id);
      if (space) {
        return {
          isSpaceSession: true,
          talk: space,
        };
      }
    }

    return null;
  };

  useEffect(() => {
    if (talkId) {
      const sessionItem = findSessionId(talkId);
      if (sessionItem) {
        setSession(sessionItem.talk);
        setIsSpacesTalk(sessionItem.isSpaceSession);
      }
    }
  }, [talkId, sessions]);

  return (
    <>
      <div className="talk grid">
        <NavigationHeader toText={toTextFixed ? toTextFixed : ""} backgroundColor="var(--chat-and-talk-background-color)" />
        <div className="talk__content">{session && <TalkItem session={session} isSpacesTalk={isSpacesTalk} />}</div>
      </div>
      <NavigationFooter />
    </>
  );
};

export default Talk;
