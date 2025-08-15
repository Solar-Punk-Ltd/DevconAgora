import { MessageData } from "@solarpunkltd/comment-system";

export interface TalkComments {
  messages?: MessageData[];
  reactions?: MessageData[];
  talkId: string;
}
