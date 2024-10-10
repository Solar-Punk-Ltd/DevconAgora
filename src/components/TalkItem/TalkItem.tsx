import React from "react";
import { SwarmCommentSystem } from "@solarpunkltd/comment-system-ui";
import { Utils } from "@ethersphere/bee-js";
import { Wallet, hexlify } from "ethers";
import "./TalkItem.scss";
import AgendaItem from "../AgendaItem/AgendaItem";
import { Session } from "../../types/session";
import { getTopic } from "../../utils/bee";
import { DUMMY_STAMP } from "../../utils/constants";
import { dateToTime, getSigner } from "../../utils/helpers";
import { useGlobalState } from "../../GlobalStateContext";

interface TalkItemProps {
  session: Session;
}

const TalkItem: React.FC<TalkItemProps> = ({ session }) => {
  const { username } = useGlobalState();

  const rawTalkTopic = session.id + "test1";
  const identifier = getTopic(rawTalkTopic);
  const privateKey = Utils.keccak256Hash(identifier);
  const wallet = new Wallet(hexlify(privateKey));
  const signer = getSigner(wallet);

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
        topic={identifier}
        signer={signer}
        beeApiUrl={process.env.BEE_API_URL}
        username={username}
      />
    </>
  );
};

export default TalkItem;
