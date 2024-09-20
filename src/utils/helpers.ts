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
    return !date ? "" :date.substring(11, 16);
}

export function getSessionsByDay(sessions: Map<string, Session[]>, day: string): Session[] {
    return sessions.get(DATE_TO_DEVCON_DAY.get(day) || "Day 1") || [];
  }