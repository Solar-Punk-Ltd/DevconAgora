import React, { useState } from "react";
import "./SpacesPage.scss";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import { CATEGORIES } from "../../utils/constants";
import SpacesItem from "../../components/Spaces/SpacesItem/SpacesItem";
import { useGlobalState } from "../../GlobalStateContext";
import HomeBackground from "../../assets/welcome-glass-effect.png";
import TalkItem from "../../components/TalkItem/TalkItem";
import { Session } from "../../types/session";

const SpacesPage: React.FC = () => {
  const { orderedList } = useGlobalState();
  const [selectedTalk, setSelectedTalk] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const handleOnClick = (category: string) => {
    const sess: Session = {
      id: category,
      sourceId: category,
      title: category,
      track: category,
      slot_start: new Date().toLocaleString(),
      slot_end: new Date().toLocaleString(),
      slot_roomId: category,
    };
    setSelectedTalk(category);
    setSession(sess);
  };

  return (
    <div className="spaces">
      <NavigationFooter />
      <div className="spaces__background">
        <img
          src={HomeBackground}
          alt=""
          width="100%"
          height="100%"
          className="spaces__background__img"
        />
      </div>

      <div className="spaces__content">
        {CATEGORIES.map((c) => (
          <div key={c} onClick={() => handleOnClick(c)}>
            <SpacesItem
              title={c}
              numberOfActiveUsers={
                orderedList.find((room) => room.topic === c)?.userCount || 0
              }
            />
          </div>
        ))}
      </div>

      {selectedTalk && session && <TalkItem session={session} />}
    </div>
  );
};

export default SpacesPage;
