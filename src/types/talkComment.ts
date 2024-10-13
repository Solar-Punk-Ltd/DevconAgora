import { LastNComments } from "@solarpunkltd/comment-system";

export interface TalkComment extends LastNComments {
  talkId: string;
}
