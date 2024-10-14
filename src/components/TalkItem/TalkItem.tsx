import React, { useEffect, useState } from "react";
import { SwarmCommentSystem } from "@solarpunkltd/comment-system-ui";
import { Comment } from "@solarpunkltd/comment-system";
import "./TalkItem.scss";
import { useGlobalState } from "../../GlobalStateContext";
import AgendaItem from "../AgendaItem/AgendaItem";
import { Session } from "../../types/session";
import { DUMMY_STAMP, MAX_COMMENTS_LOADED } from "../../utils/constants";
import { dateToTime, getSigner, getWallet } from "../../utils/helpers";
import { getTopic } from "../../utils/bee";

interface TalkItemProps {
  session: Session;
}
// TODO: load comments on-scroll -> use startix, endix
const TalkItem: React.FC<TalkItemProps> = ({ session }) => {
  const { username, loadedTalks, setLoadedTalks } = useGlobalState();
  const [comments, setComments] = useState<Comment[] | undefined>();

  const rawTalkTopic = getTopic(session.id, true);
  const wallet = getWallet(rawTalkTopic);
  const signer = getSigner(wallet);
  const [startIx, setStartIx] = useState<number>(0);
  const [endIx, setEndIx] = useState<number>(0);

  // update the loaded talk comments with the new comment
  // if the talk is not found, then replace the oldest talk with the new one
  // TODO: use MAX_PRELOADED_TALKS
  const hanldeOnComment = (newComment: Comment) => {
    const updatedComments = [...(comments || []), newComment];
    setComments(updatedComments);
    const newLoadedTalks = [...(loadedTalks || [])];
    if (loadedTalks) {
      const foundIx = loadedTalks.findIndex(
        (talk) => talk.talkId === session.id
      );
      if (foundIx > -1) {
        newLoadedTalks[foundIx].comments = updatedComments;
      } else {
        newLoadedTalks.splice(newLoadedTalks.length - 1, 1, {
          talkId: session.id,
          comments: updatedComments,
          nextIndex: endIx + 1,
        });
      }
    }
    setLoadedTalks(newLoadedTalks);
  };

  const hanldeOnRead = (start: number, end: number) => {
    setStartIx(start);
    setEndIx(end);
    console.log("start index", startIx);
    console.log("end index", endIx);
  };

  // TODO: periodically update the comments
  // TODO: swarmcommentsystem load before the talk is found, therefore the comments are not loaded
  useEffect(() => {
    if (loadedTalks) {
      const talk = loadedTalks.find((talk) => talk.talkId === session.id);
      const newLoadedTalks = [...(loadedTalks || [])];
      if (talk && talk.comments) {
        setComments(talk.comments);
        setStartIx(talk.nextIndex - talk.comments.length);
        setEndIx(talk.nextIndex - 1);
      } else {
        newLoadedTalks.splice(newLoadedTalks.length - 1, 1, {
          talkId: session.id,
          comments: [],
          nextIndex: 0,
        });
        setLoadedTalks(newLoadedTalks);
      }
    }
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
          />
        )}
      </div>
      {/* // either use a local stamp from the env or a dummy can be sent to the
      gateway */}
      <SwarmCommentSystem
        stamp={process.env.STAMP || DUMMY_STAMP}
        topic={rawTalkTopic}
        signer={signer}
        beeApiUrl={process.env.BEE_API_URL}
        username={username}
        preloadedCommnets={comments}
        onComment={hanldeOnComment}
        onRead={hanldeOnRead}
        numOfComments={MAX_COMMENTS_LOADED}
      />
    </>
  );
};

export default TalkItem;
