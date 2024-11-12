import React from "react";
import "./Spaces.scss";
import SpacesItem from "./SpacesItem/SpacesItem";
import { Room } from "../../types/room";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

interface SpacesProps {
  list: Room[];
  setSelectedTalk: (category: string) => void;
}

/** Ordered Spaces list (ordered by activity) */
const Spaces: React.FC<SpacesProps> = ({ list, setSelectedTalk }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="recent-rooms">
        <div className="recent-rooms__title">Buzz spaces</div>
      </div>

      <div>
        {list.map((room) => (
          <div key={room.topic} onClick={() => navigate(`${ROUTES.TALKS}/${room.topic}`)}>
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
