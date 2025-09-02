import { getPrivateKeyFromIdentifier, MessageData } from "@solarpunkltd/comment-system";
import { SwarmCommentSystem } from "@solarpunkltd/comment-system-ui";
import React, { useEffect, useState } from "react";

import { useGlobalState } from "../../contexts/global";
import { Session } from "../../types/session";
import { TalkComments } from "../../types/talkComment";
import { getTopic } from "../../utils/bee";
import {
  CATEGORIES,
  DEFAULT_URL,
  DUMMY_STAMP,
  MAX_CHARACTER_COUNT,
  MAX_COMMENTS_LOADED,
  MAX_PRELOADED_TALKS,
  STAGES_MAP,
} from "../../utils/constants";
import { dateToTime, getActivityHelper } from "../../utils/helpers";
import AgendaItem from "../AgendaItem/AgendaItem";

import "./TalkItem.scss";

interface TalkItemProps {
  session: Session;
  isSpacesTalk: boolean;
}

const TalkItem: React.FC<TalkItemProps> = ({ session, isSpacesTalk }) => {
  const { username, loadedTalks, setLoadedTalks, talkActivity, setTalkActivity, spacesActivity, setSpacesActivity, isContentFilterEnabled } =
    useGlobalState();
  const [comments, setComments] = useState<MessageData[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const rawTalkTopic = getTopic(session.id);
  const signer = getPrivateKeyFromIdentifier(rawTalkTopic);

  // update the loaded talk comments with the newly read/written comment
  // if the talk is not found, then replace the oldest talk with the new one
  const updateTalks = (newComments: MessageData[], isHistory: boolean) => {
    let updatedComments: MessageData[] = [];
    if (isHistory) {
      updatedComments = [...newComments, ...(comments || [])];
    } else {
      updatedComments = [...(comments || []), ...newComments];
    }
    const newLoadedTalks = [...(loadedTalks || [])];
    if (loadedTalks && loadedTalks.length > 0) {
      const foundIx = loadedTalks.findIndex((talk) => talk.talkId.includes(session.id));

      // update the already loaded talk
      if (foundIx > -1) {
        newLoadedTalks[foundIx].messages = updatedComments;
      } else {
        const newTalk: TalkComments = {
          talkId: rawTalkTopic,
          messages: updatedComments,
        };
        // push the new talk with comments if buffer is not full
        if (newLoadedTalks.length < MAX_PRELOADED_TALKS) {
          newLoadedTalks.push(newTalk);
        } else {
          // otherwise replace the first talk with the new one
          newLoadedTalks.splice(0, 1, newTalk);
        }
      }
    }

    setComments(updatedComments);
    setLoadedTalks(newLoadedTalks);
  };

  const handleOnComment = (newComment: MessageData) => {
    updateTalks([newComment], false);
  };

  const handleOnRead = (newComments: MessageData[], isHistory: boolean) => {
    updateTalks(newComments, isHistory);
  };

  // find whether the talk is already loaded the first time the component is rendered
  useEffect(() => {
    if (loadedTalks) {
      const talk = loadedTalks.find((talk) => talk.talkId.includes(session.id));
      // get the already loaded talk
      if (talk) {
        setComments(talk.messages ?? []);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loadedTalks) {
      // update active visitors of the talk
      let tmpActivity: Map<string, number>;
      const isSpacesTalk = CATEGORIES.find((c) => c.includes(session.id));
      if (!isSpacesTalk) {
        tmpActivity = new Map(talkActivity);
      } else {
        tmpActivity = new Map(spacesActivity);
      }
      const foundIx = loadedTalks.findIndex((talk) => talk.talkId.includes(session.id));
      if (foundIx > -1) {
        const activity = Number(getActivityHelper(loadedTalks[foundIx].messages, true));
        tmpActivity.set(session.id, activity);
      }

      if (!isSpacesTalk) {
        setTalkActivity(tmpActivity);
      } else {
        setSpacesActivity(tmpActivity);
      }
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
          stage={STAGES_MAP.get(session.slot_roomId || "") || ""}
          commentVersion={true}
          isSpacesTalk={isSpacesTalk}
        />
      )}
      {/* either use a local stamp from the env or a dummy can be sent to the
      gateway */}
      {!loading && (
        <SwarmCommentSystem
          stamp={process.env.STAMP || DUMMY_STAMP}
          topic={rawTalkTopic}
          signer={signer}
          beeApiUrl={process.env.BEE_API_URL || DEFAULT_URL}
          username={username}
          preloadedComments={comments}
          onComment={handleOnComment}
          onRead={handleOnRead}
          filterEnabled={isContentFilterEnabled}
          numOfComments={Number(MAX_COMMENTS_LOADED)}
          maxCharacterCount={MAX_CHARACTER_COUNT}
        />
      )}
    </>
  );
};

export default TalkItem;
