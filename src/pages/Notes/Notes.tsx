import React from "react";
import { Link } from "react-router-dom";

import HomeBackground from "../../assets/welcome-glass-effect.png";
import ActionButton from "../../components/ActionButton/ActionButton";
import PlusIcon from "../../components/icons/PlusIcon/PlusIcon";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import NoteItem from "../../components/NoteItem/NoteItem";
import { useGlobalState } from "../../contexts/global";
import { ROUTES } from "../../utils/constants";

import "./Notes.scss";

const Notes: React.FC = () => {
  const { notes } = useGlobalState();

  return (
    <div className="notes-page">
      <div className="notes-page__background">
        <img src={HomeBackground} alt="" width="100%" height="100%" />
      </div>
      <div className="notes-page__header">Notes</div>
      <Link to={`${ROUTES.NOTES}${ROUTES.NEW_NOTE}`}>
        <ActionButton>
          <PlusIcon />
          <span className="notes-page__button-text">New note</span>
        </ActionButton>
      </Link>
      <div className="notes-page__note-items">
        {notes.map((note, ix) => {
          return (
            <NoteItem
              key={ix}
              id={note.id}
              text={note.text}
              date={note.date}
              time={note.time}
            />
          );
        })}
      </div>
      <NavigationFooter />
    </div>
  );
};

export default Notes;
