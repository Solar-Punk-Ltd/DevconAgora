export const BATCH_ID_HEX_LENGTH = 64;
export const ADDRESS_HEX_LENGTH = 64;
export const FIVE_MINUTES = 1000 * 60 * 5;
export const FEEDTYPE_SEQUENCE = "sequence";

export enum ROUTES {
    APP = "/",
    WELCOME1 = "/welcome1",
    WELCOME2 = "/welcome2",
    WELCOME3 = "/welcome3",
    WELCOME4 = "/welcome4",
    PROFILECREATION = "/profilecreation",
    HOME = "/home",
    RECENT = "/recent",
    DEVCONLOUNGE = "/devconlounge",
    PROFILE = "/profile",
    GAMIFICATION = "/gamification",
    AGENDA = "/agenda",
    CATEGORIES = "/categories",
    ROOMS = "/rooms",
  };

export const CATEGORY_FILTERS = [
  "Layer 2s",
  "Core protocol",
  "Cypherpunk and privacy",
  "Usability",
  "Real World Ethereum",
  "Applied Cryptography",
  "Cryptoeconomics",
  "Coordination",
  "Developer Experience",
  "Security",
];

export const DATE_TO_DEVCON_DAY = new Map([
  [new Date("2022-10-11").toDateString(), "Day 1"],
  [new Date("2022-10-12").toDateString(), "Day 2"],
  [new Date("2022-10-13").toDateString(), "Day 3"],
  [new Date("2022-10-14").toDateString(), "Day 4"],
]);

export const STAGES_MAP = new Map([
  ["talk-1", "Stage 1"],
  ["talk-2", "Stage 2"],
  ["talk-3", "Stage 3"],
  ["talk-4", "Stage 4"],
  ["talk-5", "Stage 5"],
  ["talk-5-opening-ceremonies", "Stage 5 - opening"],
  ["workshop-1", "Workshop 1"],
  ["workshop-2", "Workshop 2"],
  ["workshop-3", "Workshop 3"],
  ["workshop-4", "Workshop 4"],
]);
