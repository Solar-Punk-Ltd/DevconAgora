import { MessageData } from "solarpunk-swarm-decentralized-chat"

interface MessageWithThread extends Omit <MessageData, 'message'> {
    message: {
        text: string;
        threadId: string | null;
        parent: string | null;
    };
}