export type TextProperty = Record<"en", string>;

export interface PretalxRoom {
  name: TextProperty;
}

export interface PretalxTrack {
  name: TextProperty;
}

export interface PretalxSubmission {
  track: PretalxTrack;
}

export interface PretalxTalkSlot {
  id: number;
  room: PretalxRoom;
  start: string;
  end: string;
  submission: PretalxSubmission;
  description: TextProperty;
}
