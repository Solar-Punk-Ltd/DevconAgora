import React, { useEffect, useState } from "react";
import "./Spaces.scss";
import SpacesItem from "./SpacesItem/SpacesItem";
import { TEST_CATEGORIES, CATEGORIES, ROUTES } from "../../utils/constants";
import Chat from "../../pages/Chat/Chat";
import { useGlobalState } from "../../GlobalStateContext";
import { RoomWithUserCounts } from "../../types/room";
import { BatchId } from "@ethersphere/bee-js";
import { getResourceId, TestgetResourceId } from "../../utils/helpers";

/** Ordered Spaces list (ordered by activity) */
const Spaces: React.FC = () => {
  const { username } = useGlobalState();
  const [orderedList, setOrderedList] = useState<RoomWithUserCounts[]>(TEST_CATEGORIES.map((catName) => ({
    topic: catName,
    url: "null",
    gateway: "null",
    userCount: undefined
  })));
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const privKey = localStorage.getItem("privKey");
  if (!privKey) {
    throw new Error("No private key found");
  }

  // User count refreshes every 15 minutes on backend. We are only fetching it, when the page loads.
  const fetchUserCount = async () => {
    const roomsWithUserCount: RoomWithUserCounts[] = await fetch(process.env.BACKEND_API_URL + "/user-count")
      .then((res) => res.json())
      .then((json) => json.filter((room: RoomWithUserCounts) => Boolean(room.userCount)))
      .catch((err) => console.error("Error fetching user counts ", err));

    const orderedRooms = roomsWithUserCount.sort((a, b) => a.userCount! - b.userCount!);
    console.log("Rooms with user counts: ", orderedList)

    setOrderedList(orderedRooms);
  }

  useEffect(() => {
    fetchUserCount();
  }, []);

  
  return (
    <div>
      <div className="recent-rooms">
        <div className="recent-rooms__title">Buzz spaces</div>
      </div>

      <div>
        {orderedList.map((room) => (
          <div key={room.topic} onClick={() => setSelectedChat(room.topic)}>
            <SpacesItem title={room.topic} numberOfActiveUsers={room.userCount!} />
          </div>
        ))}
      </div>

      {selectedChat && <Chat
        topic={selectedChat}
        privKey={privKey}
        stamp={process.env.STAMP as BatchId}
        nickname={username}
        gsocResourceId={TestgetResourceId(selectedChat)}
        session={undefined}
        topMenuColor={undefined}
        originatorPage={"Home"}
        originatorPageUrl={ROUTES.HOME}
        backAction={() => setSelectedChat(null)}
        key={selectedChat}
      />}
    </div>
  );
};

export default Spaces;
