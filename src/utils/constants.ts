export const BATCH_ID_HEX_LENGTH = 64;
export const ADDRESS_HEX_LENGTH = 64;
export const TOTAL_NUMBER_OF_SESSIONS = 353;
export const FIVE_MINNUTES = 1000 * 60 * 5;
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

export const STAGES_MAP = new Map([
  ["talk-1", "Stage 1"],
  ["talk-2", "Stage 2"],
  ["talk-3", "Stage 3"],
  ["talk-4", "Stage 4"],
  ["talk-5", "Stage 5"],
  ["workshop-1", "Workshop 1"],
  ["workshop-2", "Workshop 2"],
  ["workshop-3", "Workshop 3"],
  ["workshop-4", "Workshop 4"]
]);
