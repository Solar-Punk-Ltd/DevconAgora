import React, { useEffect, useState } from "react";
import { SwarmCommentSystem } from "@solarpunkltd/comment-system-ui";
import { Comment } from "@solarpunkltd/comment-system";
import "./TalkItem.scss";
import { useGlobalState } from "../../GlobalStateContext";
import AgendaItem from "../AgendaItem/AgendaItem";
import { Session } from "../../types/session";
import {
  DUMMY_STAMP,
  MAX_CHARACTER_COUNT,
  MAX_COMMENTS_LOADED,
  MAX_PRELOADED_TALKS,
  STAGES_MAP,
} from "../../utils/constants";
import { dateToTime, getSigner, getWallet } from "../../utils/helpers";
import { getTopic } from "../../utils/bee";
import { TalkComments } from "../../types/talkComment";

interface TalkItemProps {
  session: Session;
}
// TODO: load comments on-scroll -> use startix, endix
const TalkItem: React.FC<TalkItemProps> = ({ session }) => {
  const {
    username,
    loadedTalks,
    setLoadedTalks,
    talkActivity,
    setTalkActivity,
  } = useGlobalState();
  const [comments, setComments] = useState<Comment[] | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [startIx, setStartIx] = useState<number | undefined>();
  const [endIx, setEndIx] = useState<number | undefined>();

  const rawTalkTopic = getTopic(session.id, true);
  const wallet = getWallet(rawTalkTopic);
  const signer = getSigner(wallet);
  // update the loaded talk comments with the new comment
  // if the talk is not found, then replace the oldest talk with the new one
  const hanldeOnComment = (newComment: Comment) => {
    const updatedComments = [...(comments || []), newComment];
    const newLoadedTalks = [...(loadedTalks || [])];
    if (loadedTalks && loadedTalks.length > 0) {
      const foundIx = loadedTalks.findIndex((talk) =>
        talk.talkId.includes(session.id)
      );

      // update the already loaded talk
      if (foundIx > -1) {
        newLoadedTalks[foundIx].comments = updatedComments;
      } else {
        const newTalkComent: TalkComments = {
          talkId: rawTalkTopic,
          comments: updatedComments,
          nextIndex: endIx === undefined ? 0 : endIx + 1,
        };
        // push the new talk with comments if buffer is not full
        if (newLoadedTalks.length < MAX_PRELOADED_TALKS) {
          newLoadedTalks.push(newTalkComent);
        } else {
          // otherwise replace the first talk with the new one
          newLoadedTalks.splice(0, 1, newTalkComent);
        }
      }
    }

    setComments(updatedComments);
    setLoadedTalks(newLoadedTalks);
    setEndIx(endIx === undefined ? 0 : endIx + 1);
  };

  const hanldeOnRead = (newComments: Comment[], end: number) => {
    const tmpComments = [...(comments || []), ...newComments];
    setComments(tmpComments);
    const newStart =
      end - newComments.length > 0 ? end - newComments.length : 0;
    setStartIx(newStart);
    setEndIx(end);

    if (loadedTalks) {
      const foundIx = loadedTalks.findIndex((talk) =>
        talk.talkId.includes(session.id)
      );
      // talk was not found in the preloaded buffer, read the comments and add the talk to the buffer
      if (foundIx < 0) {
        const newLoadedTalks = [...(loadedTalks || [])];
        const newTalkComent: TalkComments = {
          talkId: rawTalkTopic,
          comments: tmpComments,
          nextIndex: end + 1,
        };
        // push the new talk with comments if buffer is not full
        if (newLoadedTalks.length < MAX_PRELOADED_TALKS) {
          newLoadedTalks.push(newTalkComent);
        } else {
          // otherwise replace the last talk with the new one
          newLoadedTalks.splice(0, 1, newTalkComent);
        }
        setLoadedTalks(newLoadedTalks);
      }
    }
  };

  // find whether the talk is already loaded the first time the component is rendered
  useEffect(() => {
    if (loadedTalks) {
      const talk = loadedTalks.find((talk) => talk.talkId.includes(session.id));
      // get the already loaded talk
      if (talk) {
        setComments(talk.comments || []);
        setStartIx(talk.nextIndex - (talk.comments?.length || 0));
        setEndIx(talk.nextIndex - 1);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loadedTalks) {
      // update active visitors of the talk
      const tmpActiveVisitors = new Map(talkActivity);
      const foundIx = loadedTalks.findIndex((talk) =>
        talk.talkId.includes(session.id)
      );
      if (foundIx > -1) {
        tmpActiveVisitors.set(session.id, loadedTalks[foundIx].nextIndex);
      }
      setTalkActivity(tmpActiveVisitors);
    }
  }, [comments]);

  return (
    <>
      {session && (
        <AgendaItem
          key={session.id}
          id={session.id}
          title={session.title}
          startDate={dateToTime(session.slot_start)}
          endDate={dateToTime(session.slot_end)}
          category={session.track}
          roomId={session.slot_roomId}
          liked={session.liked}
          paddingRight={"16px"}
          stage={
            STAGES_MAP.get(session.slot_roomId ? session.slot_roomId : "") || ""
          }
          commentVersion={true}
        />
      )}
      {/* // either use a local stamp from the env or a dummy can be sent to the
      gateway */}
      {!loading && (
        <SwarmCommentSystem
          stamp={process.env.STAMP || DUMMY_STAMP}
          topic={rawTalkTopic}
          signer={signer}
          beeApiUrl={process.env.BEE_API_URL}
          username={username}
          preloadedCommnets={comments}
          onComment={hanldeOnComment}
          onRead={hanldeOnRead}
          startIx={startIx}
          endIx={endIx}
          numOfComments={MAX_COMMENTS_LOADED}
          maxCharacterCount={MAX_CHARACTER_COUNT}
        />
      )}
    </>
  );
};

export default TalkItem;
