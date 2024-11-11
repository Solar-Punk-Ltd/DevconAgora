import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import NavigationFooter from '../../components/NavigationFooter/NavigationFooter';
import NavigationHeader from '../../components/NavigationHeader/NavigationHeader';
import TalkItem from '../../components/TalkItem/TalkItem';
import { useGlobalState } from '../../contexts/global';
import { Session } from '../../types/session';
import { DATE_TO_DEVCON_DAY, ROUTES } from '../../utils/constants';
import { getSessionsByDay } from '../../utils/helpers';

import './TalkPage.scss';

interface TalkPageProps {
  toText: string | null;
}

const TalkPage: React.FC<TalkPageProps> = ({ toText }) => {
  const { sessions } = useGlobalState();
  const { talkId } = useParams();
  const [session, setSession] = useState<Session | null>(null);
  // in case a reload the path is the talk id, choose AGENDA instead
  const toTextFixed = toText?.startsWith(ROUTES.TALKS) ? ROUTES.AGENDA : toText;

  const findSessionId = (id: string): Session | null => {
    for (let i = 0; i < sessions.size; i++) {
      const sessionsByDay = getSessionsByDay(sessions, Array.from(DATE_TO_DEVCON_DAY.keys())[i]);
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
      <NavigationHeader toText={toTextFixed ? toTextFixed : ''} backgroundColor="#F1F2F4" />
      <div className="talk__content">{session && <TalkItem session={session} />}</div>
      <NavigationFooter />
    </div>
  );
};

export default TalkPage;
