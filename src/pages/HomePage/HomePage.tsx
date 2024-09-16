import React from "react";
import DevConMainBox from "../../components/DevConMainBox/DevConMainBox";
import RecentSessions from "../../components/RecentSessions/RecentSessions";
// import UpcomingTalkBox from "../../components/UpcomingTalkBox/UpcomingTalkBox";
import "./HomePage.scss";
import { Session } from "../../types/session";
import { useEffect, useState } from "react";
import { Swarm } from "libswarm";
import { ADDRESS_HEX_LENGTH } from "../../utils/constants";
import RecentRooms from "../../components/RecentRooms/RecentRooms";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import HomeHeader from "../../components/HomeHeader/HomeHeader";
import HomeBackground from "../../assets/welcome-glass-effect.png";
import HomeLoading from "../../components/HomeLoading/HomeLoading";
import { SwarmCommentSystem } from "solarpunk-comment-system-ui";
import { ethers } from "ethers";
import { Signer, Utils } from "@ethersphere/bee-js";

interface HomePageProps {
  isLoaded?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isLoaded }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isBeeRunning, setBeeRunning] = useState(false);
  const [postageStamp, setPostageStamp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);



  const swarm = new Swarm({
    beeApi: process.env.BEE_API_URL,
    postageBatchId: "todo dummy",
  });

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
    //checkBee();
    if (sessions.length === 0) {
      getSessions(process.env.DEVCON6_SESSSIONS_HASH || "");
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setIsLoading(false);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="home-page">
      {!isLoading ? (
        <div className="home-page__background">
          <img src={HomeBackground} alt="" width="100%" height="100%" />
        </div>
      ) : null}
      <HomeHeader points={10} />
      {isLoading ? (
        <HomeLoading />
      ) : (
        <div className="home-page__content">
          <SwarmCommentSystem 
            stamp={"9d976f24b0956280dd62eaa050e97d2b7adae9a04f6e5921bbc56f5bb0bc1f69"} 
            topic={"bagoytopic-3"} 
            privateKey={wallet.privateKey}
            signer={signer}
            beeApiUrl={"http://161.97.125.121:1733"}
          />

          <DevConMainBox
            title="Devcon buzz space"
            content="Share your tought, chat with anybody without moderation and collect the reward."
            showActiveVisitors={true}
            activeVisitors={110}
            bordered={true}
          />
          <RecentSessions />
          <RecentRooms />
          {/* <UpcomingTalkBox sessions={sessions} /> */}
        </div>
      )}
      <NavigationFooter />
    </div>
  );
};

export default HomePage;
