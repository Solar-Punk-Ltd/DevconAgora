import React, { useEffect, useState } from "react";
import "./Spaces.scss";
import SpacesItem from "./SpacesItem/SpacesItem";
import { TEST_CATEGORIES, CATEGORIES, ROUTES } from "../../utils/constants";exitCode
import { RoomWithUserCounts } from "../../types/room";
import { exitCode } from "process";

interface SpacesProps {
  selectedChat: string | null,
  setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>
}

/** Ordered Spaces list (ordered by activity) */
const Spaces: React.FC<SpacesProps> = ({
  selectedChat,
  setSelectedChat
}) => {
  const [orderedList, setOrderedList] = useState<RoomWithUserCounts[]>(TEST_CATEGORIES.map((catName) => ({
    topic: catName,
    url: "null",
    gateway: "null",
    userCount: undefined
  })));

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

    </div>
  );
};

export default Spaces;
