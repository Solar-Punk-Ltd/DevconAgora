import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { hexlify, Wallet } from "ethers";
import { Utils } from "@ethersphere/bee-js";
import "./FullNotePage.scss";
import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";
import HomeBackground from "../../assets/welcome-glass-effect.png";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import PopUpQuestion from "../../components/PopUpQuestion/PopUpQuestion";
import { ROUTES, ADDRESS_HEX_LENGTH } from "../../utils/constants";
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
  const location = useLocation();
  let noteItem: NoteItemProps;
  if (location && location.state) {
    noteItem = location.state.noteItem;
  }
  const [currentNote, setCurrentNote] = useState<NoteItemProps>({});
  const [showRemovePopUp, setShowRemovePopUp] = useState(false);
  const [showUnsavePopUp, setShowUnsavePopUp] = useState(false);
  const [sending, setSending] = useState(false);
  const [saved, setSaved] = useState(true);

  const handleOnChange = (txt: string) => {
    if (txt.length <= maxCharacters) {
      const tmpNote = { ...currentNote };
      tmpNote.text = txt;
      setCurrentNote(tmpNote);
    }
    if (saved) {
      setSaved(false);
    }
  };

  // calculate the topic from the note text
  const calcRawNoteTopic = (): string => {
    let rawNoteTopic = "";
    if (currentNote.text && currentNote.text.length > 0) {
      rawNoteTopic = currentNote.id
        ? currentNote.id
        : hexlify(Utils.keccak256Hash(currentNote.text)).slice(2);
    }
    return rawNoteTopic;
  };

  const handleRemove = async () => {
    setShowRemovePopUp(false);
    const rawNoteTopic = calcRawNoteTopic();
    if (rawNoteTopic.length > 0) {
      addRemoveTopicToLocalStore(rawNoteTopic, true);
      // do not wait for save to finish
      saveNote(rawNoteTopic);
    }
    navigate(ROUTES.NOTES);
  };

  const handleUnsaveDiscard = () => {
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
    rawNoteTopic: string,
    remove: boolean
  ) => {
    if (rawNoteTopic.length !== ADDRESS_HEX_LENGTH) {
      console.log("invalid topic: ", rawNoteTopic);
      return;
    }
    const selfNoteTopicsStr = localStorage.getItem(SELF_NOTE_TOPIC) || "";
    const topicsArray = selfNoteTopicsStr.split(",");
    const index = topicsArray.indexOf(rawNoteTopic);
    if (index > -1 || remove) {
      if (remove) {
        topicsArray.splice(index, 1);
        localStorage.setItem(SELF_NOTE_TOPIC, topicsArray.join(","));
      }
      return;
    }
    // only add a new topc if not present
    topicsArray.push(rawNoteTopic);
    localStorage.setItem(SELF_NOTE_TOPIC, topicsArray.join(","));
  };

  // TODO: empty text == remove note ?
  const saveNote = async (rawNoteTopic: string) => {
    if (!currentNote.text || currentNote.text.length === 0) return;

    const date = new Date();
    const noteObj: NoteItemProps = {
      id: rawNoteTopic,
      text: currentNote.text,
      date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      time: dateToTime(date.toISOString()),
    };
    setSending(true);
    const dataRef = await uploadData(
      process.env.STAMP || DUMMY_STAMP,
      JSON.stringify(noteObj)
    );
    const wallet = new Wallet(privKey);
    const signer = getSigner(wallet);
    await updateFeed(
      wallet.address,
      signer,
      rawNoteTopic,
      process.env.STAMP || DUMMY_STAMP,
      dataRef
    );
    setSending(false);
  };

  const handleSave = async () => {
    const rawNoteTopic = calcRawNoteTopic();
    if (rawNoteTopic.length > 0) {
      addRemoveTopicToLocalStore(rawNoteTopic, false);
      // do not wait for save to finish
      saveNote(rawNoteTopic);
      setSaved(true);
    }
  };

  const fetchNote = async (topic: string) => {
    const wallet = new Wallet(privKey);
    const dataRef = await getFeedUpdate(wallet.address, topic);
    let note: NoteItemProps;
    try {
      note = JSON.parse(await getData(dataRef)) as NoteItemProps;
    } catch (error) {
      console.log(`error parsing note, ref ${dataRef}:\n ${error}`);
      return;
    }
    setCurrentNote(note);
  };

  // load note from location state if available, fetch otherwise
  useEffect(() => {
    if (noteItem) {
      setCurrentNote(noteItem);
    } else {
      if (noteId && noteId !== ROUTES.NEW_NOTE.slice(1)) {
        fetchNote(noteId);
      }
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
          leftButtonHandler={() => handleUnsaveDiscard()}
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
              if (!currentNote.text || currentNote.text.length === 0 || saved) {
                return navigate(ROUTES.NOTES);
              } else {
                return setShowUnsavePopUp(true);
              }
            }}
          />
          <div className="full-note-page__top__header__counter">
            <span className="bold">{currentNote.text?.length || 0}</span>/
            {maxCharacters.toString()}
          </div>
        </div>
        <div className="full-note-page__input">
          <textarea
            value={currentNote.text}
            onChange={(e) => handleOnChange(e.target.value)}
          />
        </div>
      </div>
      <div className="full-note-page__bottom">
        <WelcomeButton
          version={sending ? "inactive" : "outlined"}
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
