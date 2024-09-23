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

export const createMonogram = (name: string) => {
    const initials = name.split(" ").map((n) => n[0]);
    return initials.join("").toUpperCase();
}

export function formatTime(timestamp: number) {
    const date = new Date(timestamp);
    const now = new Date();

    const formatHM = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const formatDate = (date: Date) =>
        date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    ) {
        return formatHM(date);
    }

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    if (
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
    ) {
        return `Yesterday ${formatHM(date)}`;
    }

    if (date.getFullYear() === now.getFullYear()) {
        return `${formatDate(date)} ${formatHM(date)}`;
    }

    return `${date.getFullYear()} ${formatDate(date)} ${formatHM(date)}`;
}