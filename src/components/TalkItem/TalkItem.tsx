import { getPrivateKeyFromIdentifier, MessageData } from "@solarpunkltd/comment-system";
import { SwarmCommentSystem } from "@solarpunkltd/comment-system-ui";
import React, { useEffect, useState } from "react";

import { useGlobalState } from "../../contexts/global";
import { Session } from "../../types/session";
import { TalkComments } from "../../types/talkComment";
import { getTopic } from "../../utils/bee";
import {
  DEFAULT_POLL_INTERVAL,
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

import { Space } from "@/types/space";
import { fetchPoints } from "@/hooks/usePoints";

interface TalkItemProps {
  session: Session | Space;
  isSpacesTalk: boolean;
}

const TalkItem: React.FC<TalkItemProps> = ({ session, isSpacesTalk }) => {
  const {
    username,
    loadedTalks,
    setLoadedTalks,
    loadedSpaces,
    setLoadedSpaces,
    talkActivity,
    setTalkActivity,
    spacesActivity,
    setSpacesActivity,
    isContentFilterEnabled,
    setPoints,
  } = useGlobalState();
  const [comments, setComments] = useState<MessageData[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const rawTalkTopic = getTopic(session.id);
  const signer = getPrivateKeyFromIdentifier(rawTalkTopic);

  const currentLoadedTalks = isSpacesTalk ? loadedSpaces : loadedTalks;
  const setCurrentLoadedTalks = isSpacesTalk ? setLoadedSpaces : setLoadedTalks;
  const currentActivity = isSpacesTalk ? spacesActivity : talkActivity;
  const setCurrentActivity = isSpacesTalk ? setSpacesActivity : setTalkActivity;

  const updateActivity = (messages: MessageData[]) => {
    const activity = Number(getActivityHelper(messages, true));
    const tmpActivity = new Map(currentActivity);
    tmpActivity.set(session.id, activity);
    setCurrentActivity(tmpActivity);
  };

  const updateTalks = (newComments: MessageData[], isHistory: boolean) => {
    let updatedComments: MessageData[] = [];
    if (isHistory) {
      updatedComments = [...newComments, ...(comments || [])];
    } else {
      updatedComments = [...(comments || []), ...newComments];
    }

    const newLoadedTalks = [...(currentLoadedTalks || [])];
    if (newLoadedTalks && newLoadedTalks.length > 0) {
      const foundIx = newLoadedTalks.findIndex((talk) => talk.talkId.includes(session.id));

      if (foundIx > -1) {
        newLoadedTalks[foundIx].messages = updatedComments;
      } else {
        const newTalk: TalkComments = {
          talkId: rawTalkTopic,
          messages: updatedComments,
        };

        if (newLoadedTalks.length < MAX_PRELOADED_TALKS) {
          newLoadedTalks.push(newTalk);
        } else {
          newLoadedTalks.splice(0, 1, newTalk);
        }
      }
    }

    setComments(updatedComments);
    setCurrentLoadedTalks(newLoadedTalks);

    updateActivity(updatedComments);
  };

  const handleOnComment = async (newComment: MessageData) => {
    updateTalks([newComment], false);

    if (username) {
      await fetchPoints(username, setPoints);
    }
  };

  const handleOnRead = (newComments: MessageData[], isHistory: boolean) => {
    updateTalks(newComments, isHistory);
  };

  useEffect(() => {
    if (currentLoadedTalks) {
      const talk = currentLoadedTalks.find((talk) => talk.talkId.includes(session.id));
      if (talk) {
        setComments(talk.messages ?? []);
      }
    }
    setLoading(false);
  }, [currentLoadedTalks, session.id]);

  return (
    <>
      {session && (
        <AgendaItem
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
          pollInterval={DEFAULT_POLL_INTERVAL}
        />
      )}
    </>
  );
};

export default TalkItem;
