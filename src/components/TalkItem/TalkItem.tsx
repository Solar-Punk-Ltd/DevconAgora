import React, { useEffect, useState } from "react";
import { SwarmCommentSystem } from "@solarpunkltd/comment-system-ui";
import { Comment } from "@solarpunkltd/comment-system";
import "./TalkItem.scss";
import AgendaItem from "../AgendaItem/AgendaItem";
import { Session } from "../../types/session";
import { DUMMY_STAMP } from "../../utils/constants";
import { dateToTime, getSigner, getWallet } from "../../utils/helpers";
import { useGlobalState } from "../../GlobalStateContext";

interface TalkItemProps {
  session: Session;
}
// TODO: if talk not found in loadedTalks, then replace tha oldest talk with this one
// TODO: load comments on-scroll
const TalkItem: React.FC<TalkItemProps> = ({ session }) => {
  const { username, loadedTalks, setLoadedTalks } = useGlobalState();
  const [comments, setComments] = useState<Comment[] | undefined>();

  const rawTalkTopic = session.id + "test1";
  const wallet = getWallet(rawTalkTopic);
  const signer = getSigner(wallet);
  const [startIx, setStartIx] = useState<number>(0);
  const [endIx, setEndIx] = useState<number>(0);

  const hanldeOnComment = (newComment: Comment, ix: number) => {
    setEndIx(ix);
    const updatedComments = [...(comments || []), newComment];
    setComments(updatedComments);
    if (loadedTalks) {
      const foundIx = loadedTalks.findIndex(
        (talk) => talk.talkId === session.id
      );
      if (foundIx > -1) {
        const tmpLoadedTalks = [...loadedTalks];
        tmpLoadedTalks[foundIx].comments = updatedComments;
        setLoadedTalks(tmpLoadedTalks);
      }
    }
  };

  const hanldeOnRead = (ix: number) => {
    setStartIx(ix);
  };

  useEffect(() => {
    if (loadedTalks) {
      const talk = loadedTalks.find((talk) => talk.talkId === session.id);
      if (talk && talk.comments) {
        setComments(talk.comments);
        setStartIx(talk.nextIndex - talk.comments.length);
        setEndIx(talk.nextIndex);
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
        startIx={startIx}
        endIx={endIx}
        onComment={hanldeOnComment}
        onRead={hanldeOnRead}
      />
    </>
  );
};

export default TalkItem;
