export function shortenTitle(title?: string, maxTitleLength?: number): string {
    maxTitleLength = maxTitleLength || 40;
    let shortTitle = title || "No title";
    if (shortTitle.length > maxTitleLength) {
        shortTitle = shortTitle.substring(0, maxTitleLength) + "...";
    }
    return shortTitle;
}

export function dateToTime(date?: string): string {
    return !date ? "" :date.substring(11, 16);
}