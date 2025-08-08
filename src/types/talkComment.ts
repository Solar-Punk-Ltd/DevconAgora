import { VisibleMessage } from "@/hooks/useSwarmComment";

export interface TalkComments {
  messages: VisibleMessage[];
  talkId: string;
}
