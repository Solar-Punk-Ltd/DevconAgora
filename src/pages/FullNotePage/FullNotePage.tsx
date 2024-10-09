import React from "react";
import "./FullNotePage.scss";
import { ROUTES } from "../../utils/constants";
import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";
import HomeBackground from "../../assets/welcome-glass-effect.png";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import PopUpQuestion from "../../components/PopUpQuestion/PopUpQuestion";
import { useNavigate } from "react-router-dom";

interface FullNotePageProps {
  note?: string;
}

const FullNotePage: React.FC<FullNotePageProps> = ({ note }) => {
  const navigate = useNavigate();
  const [charactersCount, setCharactersCount] = React.useState(0);
  const [value, setValue] = React.useState(note);
  const [showRemovePopUp, setShowRemovePopUp] = React.useState(false);
  const [showUnSavePopUp, setShowUnSavePopUp] = React.useState(false);

  const handleOnChange = (text: string) => {
    if (text.length <= 4096) {
      setValue(text);
      setCharactersCount(text.length);
    }
  };

  const handleRemove = () => {
    setShowRemovePopUp(false);
    navigate(ROUTES.NOTES);
  };

  const handleUnSaveDiscard = () => {
    setShowUnSavePopUp(false);
    navigate(ROUTES.NOTES);
  };

  const handleUnSaveSave = () => {
    setShowUnSavePopUp(false);
    navigate(ROUTES.NOTES);
  };

  return (
    <div className="full-note-page">
      <div className="full-note-page__background">
        <img src={HomeBackground} alt="" width="100%" height="100%" />
      </div>
      {showRemovePopUp && (
        <PopUpQuestion
          question="Do you want to remove your note?"
          leftButtonText="No"
          leftButtonHandler={() => setShowRemovePopUp(false)}
          rightButtonText="Yes"
          rightButtonHandler={handleRemove}
        />
      )}
      {showUnSavePopUp && (
        <PopUpQuestion
          question="Your note is not saved yet!"
          leftButtonText="Discard"
          leftButtonHandler={() => handleUnSaveDiscard()}
          rightButtonText="Save"
          rightButtonHandler={() => handleUnSaveSave()}
        />
      )}
      <div className="full-note-page__top">
        <div className="full-note-page__top__header">
          <NavigationHeader
            to={ROUTES.NOTES}
            saveQuestionBeforeLeave={true}
            handlerInCaseOfSave={() => setShowUnSavePopUp(true)}
          />
          <div className="full-note-page__top__header__counter">
            <span className="bold">{charactersCount}</span>
            /4096
          </div>
        </div>
        <div className="full-note-page__input">
          <textarea
            value={value}
            onChange={(e) => handleOnChange(e.target.value)}
          />
        </div>
      </div>
      <div className="full-note-page__bottom">
        <WelcomeButton
          version="outlined"
          onClick={() => setShowRemovePopUp(true)}
        >
          Remove
        </WelcomeButton>
        <WelcomeButton version="filled">Save</WelcomeButton>
      </div>
      {note}
    </div>
  );
};

export default FullNotePage;
