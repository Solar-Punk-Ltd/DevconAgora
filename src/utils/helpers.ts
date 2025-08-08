import { PrivateKey } from "@ethersphere/bee-js";
import { keccak256 } from "ethers";
import React from "react";

import { Session } from "../types/session";
import { DATE_TO_DEVCON_DAY } from "../utils/constants";

export function shortenTitle(title?: string, maxTitleLength?: number): string {
  let shortTitle = title || "No title";
  maxTitleLength = maxTitleLength || shortTitle.length;
  if (shortTitle.length > maxTitleLength) {
    shortTitle = shortTitle.substring(0, maxTitleLength) + "...";
  }
  return shortTitle;
}

// From "2022-10-11T15:30:00.000Z" to "15:30"
export function dateToTime(date?: string): string {
  if (!date) {
    return "";
  }
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function getSessionsByDay(sessions: Map<string, Session[]>, day: string): Session[] {
  if (day === "all") {
    return Array.from(sessions.values()).flat();
  }
  if (day === "spaces") {
    return sessions.get("spaces") || [];
  }
  return sessions.get(DATE_TO_DEVCON_DAY.get(day) || "Day 1") || [];
}

export const createMonogram = (name: string) => {
  const initials = name.split(" ").map((n) => n[0]);
  return initials.join("").toUpperCase();
};

export function formatTime(timestamp: number) {
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
}

export function isSameDay(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getDate() === secondDate.getDate() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getFullYear() === secondDate.getFullYear()
  );
}

export function stringToBoolean(str: string | null): boolean {
  if (!str) {
    return false;
  }
  return str.toLowerCase() === "true";
}

export function booleanToString(val: boolean): string {
  return val ? "true" : "false";
}

export function textExtract(content: string): string {
  const modifiedContent = content.replace(/[\s\n]+/g, " ");

  if (modifiedContent.length > 34) {
    return modifiedContent.substring(0, 34) + "...";
  } else {
    return modifiedContent;
  }
}

// TODO: probably .fromUtf8() is sufficient
export function getSigner(input: string): PrivateKey {
  const normalized = input.trim().toLowerCase();

  const hash = keccak256(Buffer.from(normalized, "utf-8"));

  const privateKeyHex = hash.slice(2);

  return new PrivateKey(privateKeyHex);
}

export const handleKeyDown = (e: React.KeyboardEvent, key: string, callback: () => void) => {
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

export const getLocalPrivateKey = () => {
  const privKey = localStorage.getItem("privKey");
  if (privKey) {
    return privKey;
  } else {
    return "";
  }
};

export const isUserRegistered = () => {
  const privKey = getLocalPrivateKey();
  const username = localStorage.getItem("username");
  if (privKey && privKey.slice(2).length === 64 && username && username.length > 0) return true;
  else return false;
};

export function isNotFoundError(error: any): boolean {
  return error.stack?.includes("404") || error.message?.includes("Not Found") || error.message?.includes("404");
}
