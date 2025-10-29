import React, { ReactNode } from "react";

import "./NewNoteButton.scss";

interface NewNoteButtonProps {
  children?: ReactNode;
}

const NewNoteButton: React.FC<NewNoteButtonProps> = ({ children }) => {
  return <div className="new-note-button">{children}</div>;
};

export default NewNoteButton;
