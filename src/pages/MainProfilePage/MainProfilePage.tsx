import React from "react";
import DevConMainBox from "../../components/DevConMainBox/DevConMainBox";
import RecentTalks from "../../components/RecentTalks/RecentTalks";
// import UpcomingTalkBox from "../../components/UpcomingTalkBox/UpcomingTalkBox";
import "./MainProfilePage.scss";
import { Session } from "../../types/session";
import { useEffect, useState } from "react";
import { Swarm } from "libswarm";
import { ADDRESS_HEX_LENGTH } from "../../utils/constants";
import RecentRooms from "../../components/RecentRooms/RecentRooms";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import Header from "../../components/Header/Header";

const MainProfilePage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isBeeRunning, setBeeRunning] = useState(false);
  const [postageStamp, setPostageStamp] = useState<string>("");

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
    checkBee();
    if (sessions.length === 0) {
      getSessions(process.env.DEVCON6_SESSSIONS_HASH || "");
    }
  });

  return (
    <div
      style={{
        height: "100vh",
        boxSizing: "border-box",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header name="Agora"></Header>
      <div style={{ padding: "15px" }}>
        <DevConMainBox
          title="Devcon chatroom"
          content="Share your tought, chat with anybody without moderation and collect the reward."
          showActiveVisitors={true}
          activeVisitors={110}
          furtherInfo="Tell us how are you!"
        />
        <RecentTalks />
        <RecentRooms />
        {/* <UpcomingTalkBox sessions={sessions} /> */}
      </div>
      <NavigationFooter />
    </div>
  );
};

export default MainProfilePage;
