import { VisibleMessage } from "@/hooks/useSwarmComment";

export interface TalkComments {
  messages?: VisibleMessage[];
  reactions?: VisibleMessage[];
  talkId: string;
}
