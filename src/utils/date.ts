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
