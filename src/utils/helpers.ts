import { PrivateKey } from "@ethersphere/bee-js";
import { MessageData } from "@solarpunkltd/comment-system";
import { indexStrToBigint } from "@solarpunkltd/swarm-comment-js";
import React from "react";

import { Session } from "../types/session";
import { DATE_TO_DEVCON_DAY } from "../utils/constants";

export const shortenTitle = (title?: string, maxTitleLength?: number): string => {
  let shortTitle = title || "No title";
  maxTitleLength = maxTitleLength || shortTitle.length;
  if (shortTitle.length > maxTitleLength) {
    shortTitle = shortTitle.substring(0, maxTitleLength) + "...";
  }
  return shortTitle;
};

// From "2022-10-11T15:30:00.000Z" to "15:30"
export const dateToTime = (date?: string): string => {
  if (!date) {
    return "";
  }
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const getSessionsByDay = (sessions: Map<string, Session[]>, day: string): Session[] => {
  if (day === "all") {
    return Array.from(sessions.values()).flat();
  }

  return sessions.get(DATE_TO_DEVCON_DAY.get(day) || "Day 1") || [];
};

export const createMonogram = (name: string): string => {
  const initials = name.split(" ").map((n) => n[0]);
  return initials.join("").toUpperCase();
};

export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();

  const formatHM = (date: Date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const formatDate = (date: Date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  if (isSameDay(date, now)) {
    return formatHM(date);
  }

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, yesterday)) {
    return `Yesterday ${formatHM(date)}`;
  }

  if (date.getFullYear() === now.getFullYear()) {
    return `${formatDate(date)} ${formatHM(date)}`;
  }

  return `${date.getFullYear()} ${formatDate(date)} ${formatHM(date)}`;
};

export const isSameDay = (firstDate: Date, secondDate: Date): boolean => {
  return (
    firstDate.getDate() === secondDate.getDate() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getFullYear() === secondDate.getFullYear()
  );
};

export const stringToBoolean = (str: string | null): boolean => {
  if (!str) {
    return false;
  }
  return str.toLowerCase() === "true";
};

export const booleanToString = (val: boolean): string => {
  return val ? "true" : "false";
};

export const textExtract = (content: string): string => {
  const modifiedContent = content.replace(/[\s\n]+/g, " ");

  if (modifiedContent.length > 34) {
    return modifiedContent.substring(0, 34) + "...";
  } else {
    return modifiedContent;
  }
};

export const handleKeyDown = (e: React.KeyboardEvent, key: string, callback: () => void): void => {
  if (e.key === key) {
    callback();
  }
};

export const findSlotStartIx = (startIx: number, sessionsByDay: Session[], time: number): number => {
  for (let i = startIx; i < sessionsByDay.length; i++) {
    const slotStart = sessionsByDay[i].slot_start;
    if (slotStart && new Date(slotStart).getTime() > time) {
      return i > 0 ? i - 1 : 0;
    }
  }
  return -1;
};

export const getLocalPrivateKey = (): string => {
  const privKey = localStorage.getItem("privKey");
  if (!privKey) {
    console.error("Private key not found in local storage");
    return "";
  }

  try {
    new PrivateKey(privKey);
  } catch (error: any) {
    console.error("Invalid private key in local storage: ", error);
    return "";
  }

  return privKey;
};

export const isUserRegistered = (): boolean => {
  const privKey = getLocalPrivateKey();
  const username = localStorage.getItem("username");
  if (privKey && privKey.slice(2).length === 64 && username && username.length > 0) return true;
  else return false;
};

export const isNotFoundError = (error: any): boolean => {
  return error.stack?.includes("404") || error.message?.includes("Not Found") || error.message?.includes("404");
};

export const getActivityHelper = (messages: MessageData[] | undefined, last: boolean): bigint => {
  if (!messages || messages.length === 0) return 0n;

  const validMessages = messages.filter((msg) => msg.index !== undefined);

  if (validMessages.length === 0) return 0n;

  const index = last ? validMessages.length - 1 : 0;
  const parsedIndex = indexStrToBigint(validMessages[index].index);

  return parsedIndex !== undefined ? parsedIndex + 1n : 0n;
};
