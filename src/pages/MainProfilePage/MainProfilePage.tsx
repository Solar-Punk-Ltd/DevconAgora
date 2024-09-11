import BlogPostBox from "../../components/BlogPostBox/BlogPostBox";
import DevConMainBox from "../../components/DevConMainBox/DevConMainBox";
import RecentBox from "../../components/RecentBox/RecentBox";
import UpcomingTalkBox from "../../components/UpcomingTalkBox/UpcomingTalkBox";
import Header from "../Header/Header";
import "./MainProfilePage.scss";
import { Session } from "../../types/session";
import React, { useEffect, useState } from "react";
import { Swarm } from "libswarm";
import { ADDRESS_HEX_LENGTH } from "../../utils/constants";
import { ethers, ZeroHash } from "ethers";
import { Bee, Signer, Topic, Utils } from "@ethersphere/bee-js";
import { SwarmCommentSystem } from '@ethersphere/comment-system-ui';

const TEMP_BEE_API_URL = "http://161.97.125.121:1733/";
const TEMP_DEVCON6_SESSSIONS_HASH = "4e4d8fa5cb134fef91e29c367f5aaf448d8133f91a58c08408e06c94cea8dd8b"


const MainProfilePage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);

  // Create Wallet - this will be created outside the component
  let wallet: ethers.Wallet | null;
  const savedKey = localStorage.getItem("walletPrivKey");
  if (savedKey) {
    wallet = new ethers.Wallet(savedKey)
  } else {
    const tempPriv = ethers.Wallet.createRandom().privateKey;
    wallet = new ethers.Wallet(tempPriv);
    localStorage.setItem("walletPrivKey", wallet.privateKey)
  }

  const signer: Signer = {
    address: Utils.hexToBytes(wallet.address.slice(2)),
    sign: async (data: any) => {
      return await wallet.signMessage(data);
    },
  };

  const bee = new Bee(TEMP_BEE_API_URL);
  const swarm = new Swarm({ beeApi: TEMP_BEE_API_URL });

  async function getSessions(hash: string) {
    if (hash.length !== ADDRESS_HEX_LENGTH) {
      console.log("session hash invalid");
      return;
    }

    try {
      const data = JSON.parse(
        (await swarm.downloadRawData(hash, "application/json")).utf8
      );
      //console.log("data: ", data)
      const s: Session[] = data.data.items;
      //console.log("s: ", s)
      setSessions(sessions.concat(s));
    } catch (e) {
      //console.log("talk " + hash + " download/cast error", e);
    }
  }

  useEffect(() => {
    if (sessions.length === 0) {
      getSessions(TEMP_DEVCON6_SESSSIONS_HASH);
    }
  }, [sessions]);

  return (
    <div
      style={{
        height: "100vh",
        boxSizing: "border-box",
        backgroundColor: "#f5f5f5",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Header name="Agora"></Header>
      <DevConMainBox />
      <RecentBox />
      
      {/** 
       * Talks will only have this. Room should already exist when the application is launched
       * A human-readable topic needs to exist, and one master private key is enough, that is burnt in into the application,
       * rooms will be distinguished by topic
       */}
      <SwarmCommentSystem 
        stamp={"9a478f8f6ac0f2882654a1b81680ee021fbc8bcb5280d5342326d1d766b085fa"}
        topic={"bagoytopic"}
        privateKey={wallet.privateKey}
        beeApiUrl={TEMP_BEE_API_URL}
        signer={signer}
      />

      <UpcomingTalkBox sessions={sessions} />
      <BlogPostBox />
    </div>
  );
};

export default MainProfilePage;
