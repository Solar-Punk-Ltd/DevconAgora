import React from 'react';

import { RoomWithUserCounts } from '../../types/room';
import { CATEGORY_NAMES_TO_ID_MAP } from '../../utils/constants';

import SpacesItem from './SpacesItem/SpacesItem';

import './Spaces.scss';

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
          <div key={room.topic} onClick={() => setSelectedChat(CATEGORY_NAMES_TO_ID_MAP.get(room.topic))}>
            <SpacesItem title={CATEGORY_NAMES_TO_ID_MAP.get(room.topic)} numberOfActiveUsers={room.userCount!} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spaces;
