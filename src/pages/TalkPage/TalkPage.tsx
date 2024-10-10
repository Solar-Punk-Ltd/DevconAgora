import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./TalkPage.scss";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";
import TalkItem from "../../components/TalkItem/TalkItem";
import { ROUTES } from "../../utils/constants";
import { Session } from "../../types/session";
import { useGlobalState } from "../../GlobalStateContext";
import { getSessionsByDay } from "../../utils/helpers";
import { DATE_TO_DEVCON_DAY } from "../../utils/constants";

// TODO: pre-upload talk feeds
// TODO: pre-fetch recent or active talk feeds
const TalkPage: React.FC = () => {
  const { sessions } = useGlobalState();
  const { talkId } = useParams();
  const [session, setSession] = useState<Session | null>(null);

  const findSessionId = (id: string): Session | null => {
    for (let i = 0; i < sessions.size; i++) {
      const sessionsByDay = getSessionsByDay(
        sessions,
        Array.from(DATE_TO_DEVCON_DAY.keys())[i]
      );
      for (let j = 0; j < sessionsByDay.length; j++) {
        if (sessionsByDay[j].id === id) {
          return sessionsByDay[j];
        }
      }
    }

    return null;
  };

  useEffect(() => {
    if (talkId) {
      const sessionItem = findSessionId(talkId);
      if (sessionItem) {
        setSession(sessionItem);
      }
    }
  }, [talkId, sessions]);

  return (
    <div className="talk">
      <NavigationHeader to={ROUTES.AGENDA} />
      <div className="talk__content">
        {session && <TalkItem session={session} />}
      </div>
      <NavigationFooter />
    </div>
  );
};

export default TalkPage;
