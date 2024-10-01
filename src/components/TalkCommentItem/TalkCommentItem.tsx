import React, { useState } from "react";
import "./TalkCommentItem.scss";
import AgendaItem from "../AgendaItem/AgendaItem";
import { Session } from "../../types/session";
import Back from "../Back/Back";
import { dateToTime } from "../../utils/helpers";
import { SwarmCommentSystem } from "solarpunk-comment-system-ui";
import { ethers } from "ethers";
import { Signer, Utils, Data } from "@ethersphere/bee-js";

// TODO: remove these
const stamp =
  "f07a4b8b5a502edbf36cc1a4859b1ea54c0c6890068fb3bb80c681943f1f625d";
const commentTopic = "bagoytopic-3";
// const privateKey = "";

interface TalkCommentItemProps {
  session: Session;
  backgroundColor?: string;
  borderRadius?: string;
  paddingRight: string;
  originatorPage?: string;
  originatorPageUrl: string;
  onHeartClick: () => boolean;
  onTitleClick?: () => void;
  backAction: () => void | undefined | null;
}

const TalkCommentItem: React.FC<TalkCommentItemProps> = ({
  session,
  backgroundColor,
  borderRadius,
  paddingRight,
  originatorPage,
  originatorPageUrl,
  onHeartClick,
  // onTitleClick,
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
    // TODO: check any vs Data type ?
    sign: async (data: Data) => {
      return await wallet.signMessage(data);
    },
  };

  return (
    <div className="swarm-comment">
      <div
        className="talk-comment-item"
        style={{ backgroundColor, borderRadius, paddingRight }}
      >
        <Back
          where={originatorPage ? originatorPage : "Back to Agenda"}
          link={originatorPageUrl}
          backgroundColor={backgroundColor}
          action={backAction}
        />
        <AgendaItem
          key={session.id}
          title={session.title}
          startDate={dateToTime(session.slot_start)}
          endDate={dateToTime(session.slot_end)}
          category={session.track}
          roomId={session.slot_roomId}
          liked={session.liked}
          paddingRight={"16px"}
          onHeartClick={onHeartClick}
          // onTitleClick={}
        />
      </div>
      <SwarmCommentSystem
        stamp={stamp}
        topic={commentTopic}
        privateKey={wallet.privateKey}
        signer={signer}
        beeApiUrl={process.env.BEE_API_URL}
      />
    </div>
  );
};

export default TalkCommentItem;
