import React from "react";
import "./NoteItem.scss";
import { ROUTES } from "../../utils/constants";
import { Link } from "react-router-dom";

interface NoteItemProps {
  extract?: string;
  date?: string;
  time?: string;
}

const NoteItem: React.FC<NoteItemProps> = ({ extract, date, time }) => {
  return (
    <Link to={`${ROUTES.NOTES}/${ROUTES.NOTEITEM}`}>
      <div className="note-item">
        <div className="note-item__extract">{extract}</div>
        <div className="note-item__timestamp">
          <div className="note-item__timestamp__date">{date}</div>
          <div className="note-item__timestamp__time">{time}</div>
        </div>
      </div>
    </Link>
  );
};

export default NoteItem;
