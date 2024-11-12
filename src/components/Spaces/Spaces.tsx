import React from "react";
import "./Spaces.scss";
import SpacesItem from "./SpacesItem/SpacesItem";
// import { CATEGORIES } from "../../utils/constants";
import { Room } from "../../types/room";

interface SpacesProps {
  list: Room[];
  setSelectedTalk: (category: string) => void;
}

/** Ordered Spaces list (ordered by activity) */
const Spaces: React.FC<SpacesProps> = ({ list, setSelectedTalk }) => {
  return (
    <div>
      <div className="recent-rooms">
        <div className="recent-rooms__title">Buzz spaces</div>
      </div>

      <div>
        {list.map((room) => (
          <div key={room.topic} onClick={() => setSelectedTalk(room.topic)}>
            <SpacesItem
              title={room.topic}
              numberOfActiveUsers={room.userCount || -1} // TODO: active users
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spaces;
