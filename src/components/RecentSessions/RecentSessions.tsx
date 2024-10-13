import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadLastNComments } from "@solarpunkltd/comment-system-ui";
import { LastNComments } from "@solarpunkltd/comment-system";
import { TalkCommentProps, useGlobalState } from "../../GlobalStateContext";
import "./RecentSessions.scss";
import RecentSessionsItem from "./RecentSessionsItem/RecentSessionsItem";
import { Session } from "../../types/session";
import {
  FIVE_MINUTES,
  ROUTES,
  STAGES_MAP,
  DUMMY_STAMP,
} from "../../utils/constants";
import {
  getSessionsByDay,
  getSigner,
  getWallet,
  isEmpty,
} from "../../utils/helpers";

const mockStartTime = new Date("2022-10-11T12:15:00.000Z");
const numOfPreloadedTalks = 9;

interface SessionBoxProps {
  sessions: Map<string, Session[]>;
  maxSessionsShown?: number;
}

const RecentSessions: React.FC<SessionBoxProps> = ({
  sessions,
  maxSessionsShown = 9,
}) => {
  const { loadedTalks, setLoadedTalks } = useGlobalState();
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [sessionIndex, setSessionIndex] = useState<number>(0);
  const [time, setTime] = useState<number>(mockStartTime.getTime());

  const findSlotStartIx = (
    startIx: number,
    sessionsByDay: Session[]
  ): number => {
    for (let i = startIx; i < sessionsByDay.length; i++) {
      const slotStart = sessionsByDay[i].slot_start;
      if (slotStart && new Date(slotStart).getTime() > time) {
        return i > 0 ? i - 1 : 0;
      }
    }
    return -1;
  };
  // the uploaded sessions are already sorted by time and day
  // find the first session that starts after the current time
  const filterRecentSessions = () => {
    const sessionsByDay = getSessionsByDay(
      sessions,
      mockStartTime.toDateString() // time
    );
    if (sessionsByDay.length != 0) {
      const mostRecentSessions = new Array<Session>(maxSessionsShown);
      let firstSessionIx = findSlotStartIx(sessionIndex, sessionsByDay);
      firstSessionIx =
        firstSessionIx > maxSessionsShown - 1
          ? firstSessionIx
          : maxSessionsShown - 1;

      for (
        let i = 0;
        i < maxSessionsShown && 0 < sessionsByDay.length - firstSessionIx - i;
        i++
      ) {
        const recentIx = firstSessionIx - i;
        mostRecentSessions[i] = sessionsByDay[recentIx];
      }
      setSessionIndex(firstSessionIx);
      setRecentSessions(mostRecentSessions);
    }
  };

  useEffect(() => {
    // TODO: what shall be the update time ?
    const sessionUpdateInterval = FIVE_MINUTES;
    const interval = setInterval(async () => {
      // TODO: remove this: increase current time by 10 minutes to see the change in recent sessions
      setTime((time) => new Date(time + FIVE_MINUTES).getTime());
    }, sessionUpdateInterval);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterRecentSessions();
  }, [sessions, time]);

  const preLoadTalks = async () => {
    try {
      const stamp = process.env.STAMP || DUMMY_STAMP;
      const preLoadedTalks: TalkCommentProps[] = [];
      const commentPromises: Promise<LastNComments>[] = [];
      const talkIds: string[] = [];
      for (let i = 0; i < recentSessions.length; i++) {
        const sessionId = recentSessions[i].id;
        const rawTalkTopic = sessionId + "test1";
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
          loadLastNComments(
            stamp,
            rawTalkTopic,
            signer,
            process.env.BEE_API_URL,
            numOfPreloadedTalks
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
            console.log(`pre-loading talks error: `, result.reason);
          }
        });
      });

      setLoadedTalks(preLoadedTalks.length > 0 ? preLoadedTalks : undefined);
    } catch (error) {
      console.log("pre-loading talks error: ", error);
    }
  };

  useEffect(() => {
    preLoadTalks();
  }, [recentSessions]);

  return (
    <div>
      <div className="recent-sessions">
        <div className="recent-sessions__title">Recent talks</div>
        <Link to={ROUTES.AGENDA}>
          <div className="recent-sessions__all">All sessions</div>
        </Link>
      </div>
      <div className="recent-sessions__item-container">
        {recentSessions.map((session) => {
          const roomId = session.slot_roomId || "";
          const activeVisitors = Math.floor(Math.random() * 100);
          return (
            <RecentSessionsItem
              key={session.id}
              id={session.id}
              title={session.title}
              stage={STAGES_MAP.get(roomId) || "unknown"}
              activeVisitors={activeVisitors}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RecentSessions;
