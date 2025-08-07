import React from "react";
import { useNavigate } from "react-router-dom";

import { Room } from "../../types/room";
import { ROUTES } from "../../utils/constants";

import SpacesItem from "./SpacesItem/SpacesItem";

import "./Spaces.scss";

interface SpacesProps {
  list: Room[];
}

/** Ordered Spaces list (ordered by activity) */
const Spaces: React.FC<SpacesProps> = ({ list }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="recent-rooms">
        <div className="recent-rooms__title">Buzz spaces</div>
      </div>

      <div>
        {list.map((room) => (
          <div key={room.topic} onClick={() => navigate(`${ROUTES.TALKS}/${room.topic}`)}>
            <SpacesItem title={room.topic} numberOfActiveUsers={room.userCount || 0n} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spaces;
