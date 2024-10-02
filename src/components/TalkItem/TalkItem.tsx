import React from "react";
import "./TalkItem.scss";
import AgendaItem from "../AgendaItem/AgendaItem";
import { Session } from "../../types/session";
import Back from "../Back/Back";
import { dateToTime } from "../../utils/helpers";
import { SwarmCommentSystem } from "@solarpunkltd/comment-system-ui";
import { ethers } from "ethers";
import { Signer, Utils, Data } from "@ethersphere/bee-js";

// TODO: remove stamp, maybe can bee dummy because gateway overwrites it
const stamp =
  "f07a4b8b5a502edbf36cc1a4859b1ea54c0c6890068fb3bb80c681943f1f625d";

interface TalkItemProps {
  session: Session | null;
  originatorPage: string;
  originatorPageUrl: string;
  backgroundColor?: string;
  borderRadius?: string;
  paddingRight: string;
  backAction?: () => void | undefined | null;
}

const TalkItem: React.FC<TalkItemProps> = ({
  session,
  originatorPage,
  originatorPageUrl,
  backgroundColor,
  borderRadius,
  paddingRight,
  backAction,
}) => {
  // Create Wallet - this will be created outside the component
  let wallet: ethers.Wallet | null;
  const savedKey = localStorage.getItem("walletPrivKey");
  if (savedKey) {
    wallet = new ethers.Wallet(savedKey);
  } else {
    const tempPriv = ethers.Wallet.createRandom().privateKey;
    wallet = new ethers.Wallet(tempPriv);
    localStorage.setItem("walletPrivKey", wallet.privateKey);
  }

  const signer: Signer = {
    address: Utils.hexToBytes(wallet.address.slice(2)),
    sign: async (data: Data) => {
      return await wallet.signMessage(data);
    },
  };

  return (
    <div className="swarm-comment">
      <div
        className="talk-item"
        style={{ backgroundColor, borderRadius, paddingRight }}
      >
        <Back
          where={originatorPage}
          link={originatorPageUrl}
          backgroundColor={backgroundColor}
          action={backAction}
        />
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
      {session && (
        <SwarmCommentSystem
          stamp={stamp}
          topic={session.id}
          privateKey={wallet.privateKey}
          signer={signer}
          beeApiUrl={process.env.BEE_API_URL}
        />
      )}
    </div>
  );
};

export default TalkItem;
