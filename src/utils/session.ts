
import { Session } from "@/types/session";
import { DATE_TO_DEVCON_DAY } from "../constants/categories";
import { indexStrToBigint } from "@solarpunkltd/swarm-comment-js";
import { MessageData } from "@solarpunkltd/comment-system";

export const getSessionsByDay = (sessions: Map<string, Session[]>, day: string): Session[] => {
  if (day === "all") {
    return Array.from(sessions.values()).flat();
  }

  return sessions.get(DATE_TO_DEVCON_DAY.get(day) || "Day 1") || [];
};

export const determineActivityNumByMessage = (messages: MessageData[] | undefined, last: boolean): bigint => {
  if (!messages || messages.length === 0) return 0n;

  const validMessages = messages.filter((msg) => msg.index !== undefined);

  if (validMessages.length === 0) return 0n;

  const index = last ? validMessages.length - 1 : 0;
  const parsedIndex = indexStrToBigint(validMessages[index].index);

  return parsedIndex !== undefined ? parsedIndex + 1n : 0n;
};