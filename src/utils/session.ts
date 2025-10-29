import { AgendaDays, DATE_TO_EVENT_DAY } from "../constants/categories";

import { Session } from "@/types/session";
import { ALL_SESSIONS_KEY } from "@/constants";

export const getSessionsByDay = (sessions: Map<string, Session[]>, day: string): Session[] => {
  if (day === ALL_SESSIONS_KEY) {
    return Array.from(sessions.values()).flat();
  }

  return sessions.get(DATE_TO_EVENT_DAY.get(day) || AgendaDays.DAY1) || [];
};
