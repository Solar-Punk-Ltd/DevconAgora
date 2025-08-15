import { PrivateKey, Topic } from "@ethersphere/bee-js";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import HomeBackground from "../../assets/welcome-glass-effect.png";
import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";
import { NoteItemProps } from "../../components/NoteItem/NoteItem";
import PopUpQuestion from "../../components/PopUpQuestion/PopUpQuestion";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import { useGlobalState } from "../../contexts/global";
import { updateFeed, uploadData } from "../../utils/bee";
import { ADDRESS_HEX_LENGTH, DUMMY_STAMP, MAX_CHARACTER_COUNT, ROUTES, SELF_NOTE_TOPIC } from "../../utils/constants";
import { dateToTime, getLocalPrivateKey } from "../../utils/helpers";

import "./FullNote.scss";

const FullNotePage: React.FC = () => {
  const navigate = useNavigate();
  const { noteId } = useParams();
  const { notes, setNotes } = useGlobalState();
  const [currentNote, setCurrentNote] = useState<NoteItemProps>({});
  const [showRemovePopUp, setShowRemovePopUp] = useState<boolean>(false);
  const [showUnsavedPopUp, setShowUnsavedPopUp] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(true);

  const handleOnChange = (txt: string) => {
    if (txt.length <= MAX_CHARACTER_COUNT) {
      const tmpNote = { ...currentNote };
      tmpNote.text = txt;
      setCurrentNote(tmpNote);
    }
    if (saved) {
      setSaved(false);
    }
  };

  // calculate the topic from the note text
  // if note has an id, use it as topic
  const calcRawNoteTopic = (): string => {
    let rawNoteTopic = "";
    if (currentNote.id && currentNote.id.length > 0) {
      rawNoteTopic = currentNote.id;
    } else {
      if (currentNote.text && currentNote.text.length > 0) {
        rawNoteTopic = new Topic(currentNote.text).toString();
      }
    }
    return rawNoteTopic;
  };

  const handleRemove = async () => {
    setShowRemovePopUp(false);
    const rawNoteTopic = calcRawNoteTopic();
    if (rawNoteTopic.length > 0) {
      const remove = true;
      const tmpNote = { ...currentNote };
      tmpNote.text = "";
      setCurrentNote(tmpNote);
      addRemoveTopicToLocalStore(rawNoteTopic, remove);
      saveNote(rawNoteTopic, remove);
      const foundIx = notes.findIndex((n) => n.id === rawNoteTopic);
      if (foundIx > -1) {
        const tmpNotes = [...notes];
        tmpNotes.splice(foundIx, 1);
        setNotes(tmpNotes);
      }
    }
    navigate(ROUTES.NOTES);
  };

  const handleUnsaveDiscard = () => {
    setShowUnsavedPopUp(false);
    navigate(ROUTES.NOTES);
  };

  const handleUnsaved = () => {
    setShowUnsavedPopUp(false);
    handleSave();
    navigate(ROUTES.NOTES);
  };

  const privKey = getLocalPrivateKey();
  if (!privKey) {
    return (
      <div className="full-note-page__top__header">
        <NavigationHeader to={ROUTES.NOTES} />
        No private key found
      </div>
    );
  }

  const addRemoveTopicToLocalStore = (rawNoteTopic: string, remove: boolean) => {
    if (rawNoteTopic.length !== ADDRESS_HEX_LENGTH) {
      console.error("invalid topic: ", rawNoteTopic);
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

  const handleSave = async () => {
    const rawNoteTopic = calcRawNoteTopic();
    if (rawNoteTopic.length > 0) {
      const remove = false;
      addRemoveTopicToLocalStore(rawNoteTopic, remove);
      saveNote(rawNoteTopic, remove);
    }
  };

  const saveNote = async (rawNoteTopic: string, remove: boolean) => {
    let text = currentNote.text;
    if (remove) {
      text = "";
    } else {
      // save empty note, if note already exists
      if (saved && (!text || text.length === 0)) {
        return;
      }
    }

    const date = new Date();
    const noteObj: NoteItemProps = {
      id: rawNoteTopic,
      text: text,
      date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      time: dateToTime(date.toISOString()),
    };
    setSaving(true);
    const dataRef = await uploadData(process.env.STAMP || DUMMY_STAMP, JSON.stringify(noteObj));
    const signer = new PrivateKey(privKey);
    await updateFeed(signer.publicKey().address.toString(), signer, rawNoteTopic, process.env.STAMP || DUMMY_STAMP, dataRef);

    const foundIx = notes.findIndex((n) => n.id === rawNoteTopic);
    const tmpNotes = [...notes];
    if (!remove) {
      if (foundIx > -1) {
        tmpNotes[foundIx] = noteObj;
      } else {
        tmpNotes.push(noteObj);
      }
      setNotes(tmpNotes);
      setCurrentNote(noteObj);
    }
    setSaving(false);
    setSaved(true);
  };

  // load note from global state only if not creating a new note
  useEffect(() => {
    if (noteId && noteId !== ROUTES.NEW_NOTE.slice(1)) {
      const foundIx = notes.findIndex((n) => n.id === noteId);
      if (foundIx > -1) {
        setCurrentNote(notes[foundIx]);
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
      {showUnsavedPopUp && (
        <PopUpQuestion
          question="Your note is not saved yet!"
          leftButtonText="Discard"
          leftButtonHandler={() => handleUnsaveDiscard()}
          rightButtonText="Save"
          rightButtonHandler={() => handleUnsaved()}
        />
      )}
      <div className="full-note-page__top">
        <div className="full-note-page__top__header">
          <NavigationHeader
            to={ROUTES.NOTES}
            saveQuestionBeforeLeave={true}
            handlerInCaseOfSave={() => {
              if (!currentNote.text || currentNote.text.length === 0 || saved || saving) {
                return navigate(ROUTES.NOTES);
              } else {
                return setShowUnsavedPopUp(true);
              }
            }}
          />
          <div className="full-note-page__top__header__counter">
            <span className="bold">{currentNote.text?.length || 0}</span>/{MAX_CHARACTER_COUNT.toString()}
          </div>
        </div>
        <div className="full-note-page__input">
          <textarea value={currentNote.text} onChange={(e) => handleOnChange(e.target.value)} />
        </div>
      </div>
      <div className="full-note-page__bottom">
        <WelcomeButton
          version={saving || (noteId == ROUTES.NEW_NOTE.slice(1) && !saved) ? "inactive" : "outlined"}
          onClick={() => setShowRemovePopUp(true)}
        >
          Remove
        </WelcomeButton>
        <WelcomeButton version={saving || saved ? "inactive" : "filled"} onClick={() => handleSave()}>
          Save
        </WelcomeButton>
      </div>
    </div>
  );
};

export default FullNotePage;
