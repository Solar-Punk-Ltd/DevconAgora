import { CommentsWithIndex } from '@solarpunkltd/comment-system';

export interface TalkComments extends CommentsWithIndex {
  talkId: string;
}
