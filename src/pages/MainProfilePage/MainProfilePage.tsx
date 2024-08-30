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
import { Bee, Signer, Topic, Utils } from "@ethersphere/bee-js";
import { Binary } from "cafe-utility";
import { Bytes } from "mantaray-js";
import {
  SwarmCommentSystem,
  SwarmCommentSystemProps,
} from "../../components/Comment/swarm-comment-system";
// import { SwarmCommentSystemProps } from "swarm-comment-system-ui"
const TEMP_BEE_API_URL = "http://161.97.125.121:1733/";
const TEMP_DEVCON6_SESSSIONS_HASH = "4e4d8fa5cb134fef91e29c367f5aaf448d8133f91a58c08408e06c94cea8dd8b"

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

  // Topic
  const topicHumanReadable = "bagoytopic";

  // Create Wallet
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
  const swarm = new Swarm({
    beeApi: TEMP_BEE_API_URL,
    // postageBatchId: "todo dummy",
  });

  const nodepubkey =
    "03bfb125b262beafd2531171e1b4aa7b69dc4417222ff6ff58334c9fc0c96ce87f";
  const nodeaddr = "0x5fDCAeb6D886806A49F4263C0e6c45Dcf4706799";
  async function createFeed() {
    console.log(postageStamp.length)
    console.log(feed.length)
    if (postageStamp.length !== 0 && feed.length === 0 && wallet) {
      console.log("wallet address (inside createFeed)", wallet.address);
      console.log("Postage stamp (inside createFeed): ", postageStamp)
      try {
        console.log("creating feed...")
        const topicHex: Topic = bee.makeFeedTopic(topicHumanReadable)
        console.log("topicHex ", topicHex)
        const feedReference = await bee.createFeedManifest(
          postageStamp,
          "sequence",
          topicHex,
          signer.address
        );
        console.log("created feed:", feedReference.reference);
        setFeed(feedReference.reference);
      } catch (e) {
        console.log("feed gen error", e);
      }
    }
  }

  useEffect(() => {
    console.log("feed use effect")
    if (feed.length !== 0) {
      console.log("bagoy renderSwarmComments private key", wallet.privateKey);
      renderSwarmComments(COMMENTS_DIV_ID, {
        stamp: postageStamp,
        identifier: bee.makeFeedTopic(topicHumanReadable),
        approvedFeedAddress: wallet.address,
        privateKey: wallet.privateKey,
        beeApiUrl: TEMP_BEE_API_URL,
        signer
      });
    }
  }, [feed]);

  async function checkBee() {
    setBeeRunning(true);
    setPostageStamp("27d546c0e5917e247e10fa8f1ffd83166cee59a98ea3a12692db03a28b760d01");
    return;

    fetch(TEMP_BEE_API_URL + "addresses")
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
    console.log("checkBee existed (SUCCESS)")
    if (sessions.length === 0) {
      //getSessions(TEMP_DEVCON6_SESSSIONS_HASH);
    }
    console.log("Entering createFeed...")
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
