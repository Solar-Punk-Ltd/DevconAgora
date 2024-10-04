import React from "react";
import { SwarmCommentSystem } from "@solarpunkltd/comment-system-ui";
import { Signer, Utils, Data, Bee } from "@ethersphere/bee-js";
import "./TalkItem.scss";
import AgendaItem from "../AgendaItem/AgendaItem";
import { Session } from "../../types/session";
import { dateToTime } from "../../utils/helpers";
import { DEFAULT_URL } from "../../utils/constants";
import { Wallet, hexlify } from "ethers";
import { useGlobalState } from "../../GlobalStateContext";

interface TalkItemProps {
  session: Session;
}

const TalkItem: React.FC<TalkItemProps> = ({ session }) => {
  const { username } = useGlobalState();

  const bee = new Bee(process.env.BEE_API_URL || DEFAULT_URL);
  const rawTalkTopic = session.id + "test1";
  const identifier = bee.makeFeedTopic(rawTalkTopic);
  const privateKey = Utils.keccak256Hash(identifier);
  const wallet = new Wallet(hexlify(privateKey)).address;
  const signer: Signer = {
    address: Utils.hexToBytes(wallet.address.slice(2)),
    sign: async (data: Data) => {
      return await wallet.signMessage(data);
    },
  };

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
        stamp={process.env.STAMP}
        topic={identifier}
        signer={signer}
        beeApiUrl={process.env.BEE_API_URL}
        username={username}
      />
    </>
  );
};

export default TalkItem;
