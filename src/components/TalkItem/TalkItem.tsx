import { PrivateKey } from "@ethersphere/bee-js";
import React from "react";

import { useGlobalState } from "../../contexts/global";
import { Session } from "../../types/session";
import { STAGES_MAP } from "../../utils/constants";
import { dateToTime, getLocalPrivateKey } from "../../utils/helpers";
import AgendaItem from "../AgendaItem/AgendaItem";
import { Comment } from "../Comment/Comment";

import "./TalkItem.scss";

interface TalkItemProps {
  session: Session;
  isSpacesTalk: boolean;
}

const TalkItem: React.FC<TalkItemProps> = ({ session, isSpacesTalk }) => {
  const { username } = useGlobalState();

  const privKey = getLocalPrivateKey();
  if (!privKey) {
    return null;
  }

  const userSigner = new PrivateKey(privKey);

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
      {<Comment sessionId={session.id} signer={userSigner} username={username} />}
    </>
  );
};

export default TalkItem;
