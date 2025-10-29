import React from "react";
import { Link } from "react-router-dom";

import NewNoteButton from "../../components/NewNoteButton/NewNoteButton";
import PlusIcon from "../../components/icons/PlusIcon/PlusIcon";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import NoteItem from "../../components/NoteItem/NoteItem";
import { ROUTES } from "../../constants/routes";
import { useGlobalState } from "../../contexts/global";

import "./Notes.scss";

const Notes: React.FC = () => {
  const { notes } = useGlobalState();

  return (
    <div className="notes-page">
      <div className="notes-page__background grid"></div>
      <div className="notes-page__header">Notes</div>
      <Link to={`${ROUTES.NOTES}${ROUTES.NEW_NOTE}`}>
        <div className="notes-page__new-note-button">
          <NewNoteButton>
            <PlusIcon />
            <span className="notes-page__button-text">New note</span>
          </NewNoteButton>
        </div>
      </Link>
      <div className="notes-page__note-items">
        {notes.map((note, ix) => {
          return <NoteItem key={ix} id={note.id} text={note.text} date={note.date} time={note.time} />;
        })}
      </div>
      <NavigationFooter />
    </div>
  );
};

export default Notes;
