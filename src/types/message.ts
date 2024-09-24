import { MessageData } from "solarpunk-swarm-decentralized-chat"

export interface MessageWithThread extends MessageData {
    threadId: ThreadId | null;
    parent: ThreadId | null;
}

export type ThreadId = string;

// 'message' field for MessageData will be a JSON object, stringified like this:
// MessageData.messageJSON.stringify({
//    text: messageToSend,
//    threadId: "123-an-identifier",
//    parent: "123-an-identifier"
//  })