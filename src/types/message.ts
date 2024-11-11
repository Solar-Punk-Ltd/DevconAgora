import { EthAddress, MessageData } from '@solarpunkltd/swarm-decentralized-chat';

export interface MessageWithThread extends MessageData {
  threadId: ThreadId | null;
  messageId: MessageId | null;
  parent: ThreadId | null;
  text?: string;
  replyCount: number;
  likeTable: { [key: EthAddress]: boolean };
  flagged?: boolean;
  beingSent?: boolean;
}

export type LikeMessage = string;

export type ThreadId = string;
export type MessageId = string;

// 'message' field for MessageData will be a JSON object, stringified like this:
// MessageData.messageJSON.stringify({
//    text: messageToSend,
//    threadId: "123-an-identifier",
//    messageId: "123-an-identifier",
//    parent: "123-an-identifier"
//  })
