import React, { useEffect, useState } from "react";
import { SwarmCommentSystem } from "@solarpunkltd/comment-system-ui";
import { Signer, Utils, Data } from "@ethersphere/bee-js";
import "./TalkItem.scss";
import AgendaItem from "../AgendaItem/AgendaItem";
import { Session } from "../../types/session";
import { dateToTime } from "../../utils/helpers";
import { ethers } from "ethers";
import { useGlobalState } from "../../GlobalStateContext";

// TODO: remove stamp, maybe can bee dummy because gateway overwrites it
const stamp =
  "f07a4b8b5a502edbf36cc1a4859b1ea54c0c6890068fb3bb80c681943f1f625d";

interface TalkItemProps {
  session: Session | null;
}

const TalkItem: React.FC<TalkItemProps> = ({ session }) => {
  const { username } = useGlobalState();
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem("privKey");
    if (savedKey) {
      const w = new ethers.Wallet(savedKey);
      const s: Signer = {
        address: Utils.hexToBytes(w.address.slice(2)),
        sign: async (data: Data) => {
          return await w.signMessage(data);
        },
      };
      setWallet(w);
      setSigner(s);
    } else {
      console.log("No private key found in local storage");
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
      {session && wallet && signer && (
        <SwarmCommentSystem
          stamp={stamp}
          topic={session.id}
          privateKey={wallet.privateKey}
          signer={signer}
          beeApiUrl={process.env.BEE_API_URL}
          username={username}
        />
      )}
    </>
  );
};

export default TalkItem;
