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
import { SwarmCommentSystem, SwarmCommentSystemProps } from "../../components/Comment/swarm-comment-system";

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
  const [isBeeRunning, setBeeRunning] = useState(true);
  const [postageStamp, setPostageStamp] = useState<string>("52d503ddfe75c71c27accc6396a2748b83d4b2ee05529ec259d8859b5a25bfce");
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

  async function createFeed() {
    if (postageStamp.length !== 0 && feed.length === 0 && wallet) {
      try {
        console.info("creating feed...")
        const topicHex: Topic = bee.makeFeedTopic(topicHumanReadable)
        
        const feedReference = await bee.createFeedManifest(
          postageStamp,
          "sequence",
          topicHex,
          signer.address
        );

        console.info(`created feed with reference ${feedReference.reference}`);
        setFeed(feedReference.reference);
      } catch (e) {
        console.error("feed gen error", e);
      }
    }
  }

  useEffect(() => {
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

  async function getSessions(hash: string) {
    if (hash.length !== ADDRESS_HEX_LENGTH) {
      console.log("session hash invalid");
      return;
    }

    try {
      const data = JSON.parse(
        (await swarm.downloadRawData(hash, "application/json")).utf8
      );
      console.log("data: ", data)
      const s: Session[] = data.data.items;
      console.log("s: ", s)
      setSessions(sessions.concat(s));
    } catch (e) {
      console.log("talk " + hash + " download/cast error", e);
    }
  }

  useEffect(() => {
    if (sessions.length === 0) {
      getSessions(TEMP_DEVCON6_SESSSIONS_HASH);
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
