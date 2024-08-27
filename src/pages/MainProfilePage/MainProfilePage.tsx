import BlogPostBox from "../../components/BlogPostBox/BlogPostBox";
import DevConMainBox from "../../components/DevConMainBox/DevConMainBox";
import RecentBox from "../../components/RecentBox/RecentBox";
import UpcomingTalkBox from "../../components/UpcomingTalkBox/UpcomingTalkBox";
import Header from "../Header/Header";
import "./MainProfilePage.scss";
import { Session } from "../../types/session";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Swarm } from "libswarm";
import { ADDRESS_HEX_LENGTH } from "../../utils/constants";
import { ethers, ZeroHash } from "ethers";
import { Bee } from "@ethersphere/bee-js";
import { Binary } from "cafe-utility";
import { Bytes } from "mantaray-js";
import {
  SwarmCommentSystem,
  SwarmCommentSystemProps,
} from "../../components/Comment/swarm-comment-system";
// import { SwarmCommentSystemProps } from "swarm-comment-system-ui"

function renderSwarmComments(id: string, props: SwarmCommentSystemProps) {
  ReactDOM.createRoot(document.getElementById(id)!).render(
    <React.StrictMode>
      <SwarmCommentSystem {...props} />
    </React.StrictMode>
  );
}

const COMMENTS_DIV_ID = "comments";

const MainProfilePage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isBeeRunning, setBeeRunning] = useState(false);
  const [postageStamp, setPostageStamp] = useState<string>("");
  const [feed, setFeed] = useState<string>("");

  const wallet = ethers.Wallet.createRandom();
  const bee = new Bee(process.env.BEE_API_URL || "");
  const swarm = new Swarm({
    beeApi: process.env.BEE_API_URL,
    // postageBatchId: "todo dummy",
  });

  const nodepubkey =
    "03bfb125b262beafd2531171e1b4aa7b69dc4417222ff6ff58334c9fc0c96ce87f";
  const nodeaddr = "0x5fDCAeb6D886806A49F4263C0e6c45Dcf4706799";
  async function createFeed() {
    if (postageStamp.length !== 0 && feed.length === 0) {
      console.log("wallet address", wallet.address);
      try {
        const feedReference = await bee.createFeedManifest(
          postageStamp,
          "sequence",
          ZeroHash,
          wallet.address
        );
        console.log("created feed:", feedReference.reference);
        setFeed(feedReference.reference);
      } catch (e) {
        console.log("feed gen error", e);
      }
    }
  }

  useEffect(() => {
    if (feed.length !== 0) {
      console.log("bagoy renderSwarmComments private key", wallet.privateKey);
      renderSwarmComments(COMMENTS_DIV_ID, {
        identifier: bee.makeFeedTopic("bagoytopic"),
        approvedFeedAddress: wallet.address,
        privateKey: wallet.privateKey,
        beeApiUrl: process.env.BEE_API_URL,
        beeDebugApiUrl: process.env.BEE_API_URL,
      });
    }
  }, [feed]);

  async function checkBee() {
    fetch(process.env.BEE_API_URL + "addresses")
      .then(async () => {
        if (!isBeeRunning) {
          setBeeRunning(true);
          console.log("Bee is running");
        }
        if (postageStamp.length === 0) {
          const stamp = await swarm.getUsableStamp();
          if (stamp === null) {
            console.log("No usable postage stamp found");
          } else {
            setPostageStamp(stamp);
            console.log("Usable postage stamp found: " + stamp);
          }
        }
      })
      .catch(() => {
        setBeeRunning(false);
        setPostageStamp("");
        console.log("Bee stopped running");
      });
  }

  async function getSessions(hash: string) {
    if (hash.length !== ADDRESS_HEX_LENGTH) {
      console.log("session hash invalid");
      return;
    }

    try {
      const data = JSON.parse(
        (await swarm.downloadRawData(hash, "application/json")).utf8
      );
      const s: Session[] = data.data.items;
      setSessions(sessions.concat(s));
    } catch (e) {
      console.log("talk " + hash + " download/cast error", e);
    }
  }

  useEffect(() => {
    checkBee();
    if (sessions.length === 0) {
      getSessions(process.env.DEVCON6_SESSSIONS_HASH || "");
    }
    createFeed();
  }, [sessions, isBeeRunning, postageStamp]);

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
      <div id={COMMENTS_DIV_ID}>
        {/* renderSwarmComments finds and renders to the div with the given id*/}
      </div>
      <UpcomingTalkBox sessions={sessions} />
      <BlogPostBox />
    </div>
  );
};

export default MainProfilePage;
