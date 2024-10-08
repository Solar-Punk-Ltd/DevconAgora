import React from "react";
import "./NotesPage.scss";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import ActionButton from "../../components/ActionButton/ActionButton";
import PlusIcon from "../../components/icons/PlusIcon/PlusIcon";
import HomeBackground from "../../assets/welcome-glass-effect.png";
import NoteItem from "../../components/NoteItem/NoteItem";
import { textExtract } from "../../utils/helpers";
import { ROUTES } from "../../utils/constants";
import { Link } from "react-router-dom";

const NotesPage: React.FC = () => {
  const exampleContent = `The first couple words of the note. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Why do we use it? It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`;
  const extractedContent = textExtract(exampleContent);

  return (
    <div className="notes-page">
      <div className="notes-page__background">
        <img src={HomeBackground} alt="" width="100%" height="100%" />
      </div>
      <div className="notes-page__header">Notes</div>
      <Link to={`${ROUTES.NOTES}/${ROUTES.NOTEITEM}`}>
        <ActionButton>
          <PlusIcon />
          <span className="notes-page__button-text">New note</span>
        </ActionButton>
      </Link>
      <NoteItem extract={extractedContent} date="01/01/24" time="09:21" />
      <NoteItem extract={extractedContent} date="01/01/24" time="09:21" />
      <NoteItem extract={extractedContent} date="01/01/24" time="09:21" />
      <NavigationFooter />
    </div>
  );
};

export default NotesPage;
