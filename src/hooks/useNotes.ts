import { PrivateKey, Topic } from "@ethersphere/bee-js";
import { useCallback, useEffect, useState } from "react";

import { NoteItemProps } from "../components/NoteItem/NoteItem";
import { useGlobalState } from "../contexts/global";
import { getFeedUpdate } from "../utils/bee";
import { SELF_NOTE_TOPIC } from "../utils/constants";
import { getLocalPrivateKey } from "../utils/helpers";

export const useNotes = () => {
  const { notes, setNotes } = useGlobalState();
  const [noteRawTopics, setNoteRawTopics] = useState<string[]>([]);

  const fetchNotes = useCallback(async () => {
    const privKey = getLocalPrivateKey();
    if (!privKey) {
      console.error("private key not found - cannot fetch notes");
      return;
    }

    const wallet = new PrivateKey(privKey);
    const feedPromises: Promise<string>[] = [];
    for (let i = 0; i < noteRawTopics.length; i++) {
      const rawTopic = noteRawTopics[i];
      feedPromises.push(getFeedUpdate(wallet.publicKey().address().toString(), rawTopic, true));
    }

    const notesArray: string[] = [];
    const results = await Promise.allSettled(feedPromises);
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        if (result.value.length > 0) {
          notesArray.push(result.value);
        }
      } else {
        console.error(`fetching note data error: `, result.reason);
      }
    });

    const tmpNotes: NoteItemProps[] = [];
    for (let i = 0; i < notesArray.length; i++) {
      let note: NoteItemProps | undefined = undefined;
      try {
        note = JSON.parse(notesArray[i]) as NoteItemProps;
      } catch (error) {
        console.error(`error parsing notes[${i}]:\n ${error}`);
        continue;
      }
      const exists = notes.some((n) => n.id === note.id);
      if (!exists && note !== undefined) {
        tmpNotes.push(note);
      }
    }
    tmpNotes.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    });
    setNotes(tmpNotes);

    console.debug("self notes updated");
  }, [noteRawTopics, setNotes]);
  // Note: notes intentionally excluded from deps to avoid infinite loop

  useEffect(() => {
    const selfNoteTopicsStr = localStorage.getItem(SELF_NOTE_TOPIC);
    if (selfNoteTopicsStr) {
      const tmpTopics = selfNoteTopicsStr.split(",");
      const filteredTopics = tmpTopics.filter((t) => t.length === Topic.LENGTH * 2);
      setNoteRawTopics(filteredTopics);
    }
  }, [setNoteRawTopics]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return { fetchNotes };
};
