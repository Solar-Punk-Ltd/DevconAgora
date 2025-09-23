import { getPrivateKeyFromIdentifier, MessageData } from "@solarpunkltd/comment-system";
import { SwarmCommentSystem } from "@solarpunkltd/comment-system-ui";
import React, { useEffect, useState } from "react";

import { DEFAULT_POLL_INTERVAL, MAX_CHARACTER_COUNT, MAX_COMMENTS_LOADED, MAX_PRELOADED_TALKS } from "../../constants/app";
import { STAGES_MAP } from "../../constants/categories";
import { DEFAULT_URL, DUMMY_STAMP } from "../../constants/network";
import { useGlobalState } from "../../contexts/global";
import { Session } from "../../types/session";
import { TalkComments } from "../../types/talkComment";
import { getTopic } from "../../utils/bee";
import AgendaItem from "../AgendaItem/AgendaItem";

import "./TalkItem.scss";

import { useUserContext } from "@/contexts/user";
import { Space } from "@/types/space";
import { dateToTime } from "@/utils/date";
import { determineActivityNumByMessage } from "@/utils/session";
import { createUniqueUsername } from "../../utils/user";

interface TalkItemProps {
  session: Session | Space;
  isSpacesTalk: boolean;
}

const TalkItem: React.FC<TalkItemProps> = ({ session, isSpacesTalk }) => {
  const { loadedTalks, setLoadedTalks, loadedSpaces, setLoadedSpaces, talkActivity, setTalkActivity, spacesActivity, setSpacesActivity } =
    useGlobalState();
  const { username, keys } = useUserContext();

  const [comments, setComments] = useState<MessageData[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const rawTalkTopic = getTopic(session.id);
  const signer = getPrivateKeyFromIdentifier(rawTalkTopic);

  const currentLoadedTalks = isSpacesTalk ? loadedSpaces : loadedTalks;
  const setCurrentLoadedTalks = isSpacesTalk ? setLoadedSpaces : setLoadedTalks;
  const currentActivity = isSpacesTalk ? spacesActivity : talkActivity;
  const setCurrentActivity = isSpacesTalk ? setSpacesActivity : setTalkActivity;

  const updateActivity = (messages: MessageData[]) => {
    const activity = Number(determineActivityNumByMessage(messages, true));
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

    const transformedComments = updatedComments.map((c) => ({ ...c, username: createUniqueUsername(c.username, c.address) }));
    setComments(transformedComments);
    setCurrentLoadedTalks(newLoadedTalks);

    updateActivity(transformedComments);
  };

  const handleOnComment = async (newComment: MessageData) => {
    updateTalks([newComment], false);
  };

  const handleOnRead = (newComments: MessageData[], isHistory: boolean) => {
    updateTalks(newComments, isHistory);
  };

  useEffect(() => {
    if (currentLoadedTalks) {
      const talk = currentLoadedTalks.find((talk) => talk.talkId.includes(session.id));
      if (talk) {
        setComments(talk.messages?.map((c) => ({ ...c, username: createUniqueUsername(c.username, c.address) })) ?? []);
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
          username={createUniqueUsername(username, keys.public)}
          preloadedComments={comments}
          onComment={handleOnComment}
          onRead={handleOnRead}
          filterEnabled={false}
          numOfComments={Number(MAX_COMMENTS_LOADED)}
          maxCharacterCount={MAX_CHARACTER_COUNT}
          pollInterval={DEFAULT_POLL_INTERVAL}
        />
      )}
    </>
  );
};

export default TalkItem;
