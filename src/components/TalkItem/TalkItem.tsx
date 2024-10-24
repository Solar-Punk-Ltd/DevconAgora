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
  const { username, loadedTalks, setLoadedTalks } = useGlobalState();
  const [comments, setComments] = useState<Comment[] | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [startIx, setStartIx] = useState<number>(0);
  const [endIx, setEndIx] = useState<number>(0);

  const rawTalkTopic = getTopic(session.id, true);
  const wallet = getWallet(rawTalkTopic);
  const signer = getSigner(wallet);

  // update the loaded talk comments with the new comment
  // if the talk is not found, then replace the oldest talk with the new one
  const hanldeOnComment = (newComment: Comment) => {
    const updatedComments = [...(comments || []), newComment];
    const newLoadedTalks = [...(loadedTalks || [])];
    if (loadedTalks && loadedTalks.length > 0) {
      const foundIx = loadedTalks.findIndex(
        (talk) => talk.talkId === session.id
      );
      // update the already loaded talk
      if (foundIx > -1) {
        newLoadedTalks[foundIx].comments = updatedComments;
      }
    } else {
      const newTalkComent: TalkComments = {
        talkId: session.id,
        comments: updatedComments,
        nextIndex: endIx + 1,
      };
      // push the new talk with comments if buffer is not full
      if (newLoadedTalks.length < MAX_PRELOADED_TALKS) {
        newLoadedTalks.push(newTalkComent);
      } else {
        // otherwise replace the last talk with the new one
        newLoadedTalks.splice(newLoadedTalks.length - 1, 1, newTalkComent);
      }
    }

    setComments(updatedComments);
    setLoadedTalks(newLoadedTalks);
    setEndIx(endIx + 1);
  };

  const hanldeOnRead = (newComments: Comment[], end: number) => {
    setComments([...(comments || [])].concat(newComments));
    const newStart =
      end - newComments.length > 0 ? end - newComments.length : 0;
    setStartIx(newStart);
    setEndIx(end);
  };

  // find whether the talk is already loaded the first time the component is rendered
  useEffect(() => {
    if (loadedTalks) {
      const talk = loadedTalks.find((talk) => talk.talkId === session.id);
      // load the already loaded talk
      if (talk && talk.comments) {
        setComments(talk.comments);
        setStartIx(talk.nextIndex - talk.comments.length);
        setEndIx(talk.nextIndex - 1);
      }
    }
    setLoading(false);
  }, []);

  return (
    <>
      <div className="talk-item">
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
            stage={STAGES_MAP.get(
              session.slot_roomId ? session.slot_roomId : ""
            )}
            commentVersion={true}
          />
        )}
      </div>
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
