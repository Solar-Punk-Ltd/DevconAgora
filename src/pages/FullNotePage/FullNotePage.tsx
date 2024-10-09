import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hexlify, Wallet } from "ethers";
import { Utils } from "@ethersphere/bee-js";
import "./FullNotePage.scss";
import { ROUTES } from "../../utils/constants";
import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";
import HomeBackground from "../../assets/welcome-glass-effect.png";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import PopUpQuestion from "../../components/PopUpQuestion/PopUpQuestion";
import { DUMMY_STAMP, SELF_NOTE_TOPIC } from "../../utils/constants";
import { getSigner, dateToTime } from "../../utils/helpers";
import {
  updateFeed,
  uploadData,
  getFeedUpdate,
  getData,
} from "../../utils/bee";
import { NoteItemProps } from "../../components/NoteItem/NoteItem";

const maxCharacters = 4096;

const FullNotePage: React.FC = () => {
  const navigate = useNavigate();
  const { noteId } = useParams();
  const [charactersCount, setCharactersCount] = React.useState(0);
  const [text, setText] = React.useState<string>("");
  const [showRemovePopUp, setShowRemovePopUp] = React.useState(false);
  const [showUnsavePopUp, setShowUnsavePopUp] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [saved, setSaved] = React.useState(true);

  const handleOnChange = (txt: string) => {
    if (txt.length <= maxCharacters) {
      setText(txt);
      setCharactersCount(txt.length);
    }
    if (saved) {
      setSaved(false);
    }
  };

  // TOOD: remove note from local storage, do we need to wait for feed update removal? probably not -> fix it
  const handleRemove = async () => {
    setShowRemovePopUp(false);
    const rawSelfNoteTopic = hexlify(Utils.keccak256Hash(text));
    addRemoveTopicToLocalStore(rawSelfNoteTopic, true);
    saveNote(rawSelfNoteTopic);
    navigate(ROUTES.NOTES);
  };

  const handleUnSaveDiscard = () => {
    setShowUnsavePopUp(false);
    navigate(ROUTES.NOTES);
  };

  const handleUnsave = () => {
    setShowUnsavePopUp(false);
    navigate(ROUTES.NOTES);
  };

  const privKey = localStorage.getItem("privKey");
  if (!privKey) {
    return (
      <div className="full-note-page__top__header">
        <NavigationHeader to={ROUTES.NOTES} />
        No private key found
      </div>
    );
  }

  const addRemoveTopicToLocalStore = (
    rawSelfNoteTopic: string,
    remove: boolean
  ) => {
    const selfNoteTopicsStr = localStorage.getItem(SELF_NOTE_TOPIC) || "";
    const separator = selfNoteTopicsStr.length > 1 ? "," : "";
    if (remove) {
      localStorage.setItem(
        SELF_NOTE_TOPIC,
        selfNoteTopicsStr.replace(`${separator}${rawSelfNoteTopic}`, "")
      );
    } else {
      localStorage.setItem(
        SELF_NOTE_TOPIC,
        selfNoteTopicsStr.concat(`${separator}${rawSelfNoteTopic}`)
      );
    }
  };

  // TODO: empty text == remove note ?
  const saveNote = async (rawSelfNoteTopic: string) => {
    if (!text) return;

    const date = new Date();
    const noteObj: NoteItemProps = {
      id: rawSelfNoteTopic,
      text: text,
      date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      time: dateToTime(date.toISOString()),
    };
    setSending(true);
    const dataRef = await uploadData(
      process.env.STAMP || DUMMY_STAMP,
      JSON.stringify(noteObj)
    );
    console.log("bagoy dataRef: ", dataRef);
    const wallet = new Wallet(privKey);
    const signer = getSigner(wallet);
    await updateFeed(
      wallet.address,
      signer,
      rawSelfNoteTopic,
      process.env.STAMP || DUMMY_STAMP,
      dataRef
    );
    setSending(false);
  };

  const handleSave = async () => {
    const rawSelfNoteTopic = hexlify(Utils.keccak256Hash(text));
    addRemoveTopicToLocalStore(rawSelfNoteTopic, false);
    await saveNote(rawSelfNoteTopic);
    setSaved(true);
  };

  const fetchNote = async (topic: string) => {
    const wallet = new Wallet(privKey);
    const dataRef = await getFeedUpdate(wallet.address, topic);
    let note: NoteItemProps;
    try {
      note = JSON.parse(await getData(dataRef)) as NoteItemProps;
    } catch (error) {
      console.log("error parsing note: ", error);
      return;
    }
    setText(note.text);
    setCharactersCount(note.text.length);
  };

  useEffect(() => {
    if (noteId && noteId !== ROUTES.NEW_NOTE.slice(1)) {
      fetchNote(noteId);
    }
  }, []);

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
      {showUnsavePopUp && (
        <PopUpQuestion
          question="Your note is not saved yet!"
          leftButtonText="Discard"
          leftButtonHandler={() => handleUnSaveDiscard()}
          rightButtonText="Save"
          rightButtonHandler={() => handleUnsave()}
        />
      )}
      <div className="full-note-page__top">
        <div className="full-note-page__top__header">
          <NavigationHeader
            to={ROUTES.NOTES}
            saveQuestionBeforeLeave={true}
            handlerInCaseOfSave={() => {
              if (!text || text.length === 0 || saved) {
                return navigate(ROUTES.NOTES);
              } else {
                return setShowUnsavePopUp(true);
              }
            }}
          />
          <div className="full-note-page__top__header__counter">
            <span className="bold">{charactersCount}</span>/
            {maxCharacters.toString()}
          </div>
        </div>
        <div className="full-note-page__input">
          <textarea
            value={text}
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
        <WelcomeButton
          version={sending ? "inactive" : "filled"}
          onClick={() => handleSave()}
        >
          Save
        </WelcomeButton>
      </div>
    </div>
  );
};

export default FullNotePage;
