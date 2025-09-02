import React from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../utils/constants";
import { textExtract } from "../../utils/helpers";

import "./NoteItem.scss";

export interface NoteItemProps {
  id?: string;
  text?: string;
  date?: string;
  time?: string;
}

const NoteItem: React.FC<NoteItemProps> = ({ id, text, date, time }) => {
  return (
    <Link to={`${ROUTES.NOTES}/${id}`}>
      <div className="note-item">
        <div className="note-item__extract">{textExtract(text || "")}</div>
        <div className="note-item__timestamp">
          <div className="note-item__timestamp__date">{date}</div>
          <div className="note-item__timestamp__time">{time}</div>
        </div>
      </div>
    </Link>
  );
};

export default NoteItem;
