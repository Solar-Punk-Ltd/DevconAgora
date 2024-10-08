import React, { useEffect, useState } from "react";
import { Wallet } from "ethers";
import { getFeedUpdate, getData } from "../../utils/bee";
import "./NotesPage.scss";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import ActionButton from "../../components/ActionButton/ActionButton";
import PlusIcon from "../../components/icons/PlusIcon/PlusIcon";
import HomeBackground from "../../assets/welcome-glass-effect.png";
import NoteItem, { NoteItemProps } from "../../components/NoteItem/NoteItem";
import { ROUTES } from "../../utils/constants";
import { Link } from "react-router-dom";

const NotesPage: React.FC = () => {
  // TODO: store the feed indices to improve performance
  const [feedRawTopics, setFeedRawTopics] = useState<string[]>([]);
  const [notes, setNotes] = useState<NoteItemProps[]>([]);
  const [loading, setLoading] = React.useState(false);

  const privKey = localStorage.getItem("privKey");
  if (!privKey) {
    return (
      <div className="notes-page-error">
        No private key found
        <NavigationFooter />
      </div>
    );
  }

  // TODO: do not show notes if data empty == removed
  const fetchNotes = async () => {
    const wallet = new Wallet(privKey);
    for (let i = 0; i < feedRawTopics.length; i++) {
      // TODO: check if data.id === topic ?
      const rawTopic = feedRawTopics[i];
      const dataRef = await getFeedUpdate(wallet.address, rawTopic);
      const note = JSON.parse(await getData(dataRef)) as NoteItemProps;
      if (note.text.length > 0) {
        console.log(`text id: ${note.id} updated`);
        const found = notes.find((n) => n.id === note.id);
        if (!found) {
          setNotes([...notes, note]);
        }
      } else {
        console.log(`text id: ${note.id} empty`);
      }

      console.log(
        `feedRawTopics[${i}] note ref updated: ${dataRef} for rawTopic/id: ${rawTopic}/${note.id}`
      );
    }
  };

  useEffect(() => {
    const selfNoteTopicsStr = localStorage.getItem("selfNoteTopics");
    if (selfNoteTopicsStr) {
      console.log("bagoy setFeedRawTopics: ", selfNoteTopicsStr);
      setFeedRawTopics(selfNoteTopicsStr.split(","));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchNotes();
    setLoading(false);
    console.log("bagoy notes.length: ", notes.length);
  }, [feedRawTopics]);
  // TOOD: bug, jsut the first note is loaded, after saving the file it appears
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
      {notes.length > 0 ? (
        notes.map((note, ix) => {
          return (
            <NoteItem
              key={ix}
              id={note.id}
              text={note.text}
              date={note.date}
              time={note.time}
            />
          );
        })
      ) : (
        <div className="notes-page__no-note">
          {loading ? "Loading notes..." : "There are no notes yet."}
        </div>
      )}
      <NavigationFooter />
    </div>
  );
};

export default NotesPage;
