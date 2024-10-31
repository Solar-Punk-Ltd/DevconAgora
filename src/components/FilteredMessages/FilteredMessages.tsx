import React from "react";
import { MessageWithThread, ThreadId } from "../../types/message";
import { EthAddress, SwarmChat } from "@solarpunkltd/swarm-decentralized-chat";
import { BatchId } from "@ethersphere/bee-js";
import Messages from "../Messages/Messages";

interface FilteredMessagesProps {
    messages: MessageWithThread[];
    nickname: string;
    ownAddress: EthAddress;
    chat: SwarmChat | null;
    topic: string;
    stamp: BatchId;
    privKey: string;
    currentThread: ThreadId | null;
    filteringEnabled: boolean;
    setThreadId: React.Dispatch<React.SetStateAction<string | null>>;
    filterFunction: (message: MessageWithThread) => boolean;
}


const FilteredMessages: React.FC<FilteredMessagesProps> = ({
  messages,
  nickname,
  ownAddress,
  chat,
  topic,
  stamp,
  privKey,
  currentThread,
  filteringEnabled,
  setThreadId,
  filterFunction
}) => {
  const filteredMessages = messages.filter((msg) => filterFunction(msg));

  if (!chat) return <></>;


  return (
    <Messages
      messages={filteringEnabled ? filteredMessages : messages}
      nickname={nickname}
      ownAddress={ownAddress}
      chat={chat}
      topic={topic}
      stamp={stamp}
      privKey={privKey}
      currentThread={currentThread}
      setThreadId={setThreadId}
      key={`${currentThread}-${filteredMessages.length}`}
  />
  )
}

export default FilteredMessages;