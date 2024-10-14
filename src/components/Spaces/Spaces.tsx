import React from "react";
import "./Spaces.scss";
import SpacesItem from "./SpacesItem/SpacesItem";
import { RoomWithUserCounts } from "../../types/room";

interface SpacesProps {
  list: RoomWithUserCounts[];
  setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>;
}

/** Ordered Spaces list (ordered by activity) */
const Spaces: React.FC<SpacesProps> = ({ list, setSelectedChat }) => {
  return (
    <div>
      <div className="recent-rooms">
        <div className="recent-rooms__title">Buzz spaces</div>
      </div>

      <div>
        {list.map((room) => (
          <div key={room.topic} onClick={() => setSelectedChat(room.topic)}>
            <SpacesItem
              title={room.topic}
              numberOfActiveUsers={room.userCount!}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spaces;
