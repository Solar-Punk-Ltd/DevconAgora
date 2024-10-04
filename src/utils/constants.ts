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
  DEVCONLOUNGE = "/devconlounge",
  PROFILE = "/profile",
  GAMIFICATION = "/gamification",
  AGENDA = "/agenda",
  CATEGORIES = "/categories",
  SPACES = "/spaces",
  HOWDOESITWORK = "/how-does-it-work",
  CLAIMREWARD = "/claim-reward",
  CONTENTFILTER = "/content-filter",
  TERMSANDCONDITIONS = "/terms-and-conditions",
  NOTES = "/notes",
}

export const CATEGORIES = [
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

export const RESOURCE_IDS = {
  "Layer 2s":
    "1405000000000000000000000000000000000000000000000000000000000000",
  "Core protocol": "null",
  "Cypherpunk and privacy": "null",
  Usability: "null",
  "Real World Ethereum": "null",
  "Applied Cryptography": "null",
  Cryptoeconomics: "null",
  Coordination: "null",
  "Developer Experience": "null",
  Security: "null",
};

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

export const DISCLAIMER_OF_LIABILITY_HEADER = "Disclaimer of Liability";
export const DISCLAIMER_OF_LIABILITY =
  "The developer of this application disclaims any liability for content shared or viewed within the app. Users are solely responsible for their actions and communications and should comply with all applicable laws and regulations.";
export const PERSONAL_DATA_HEADER = "Personal Data";
export const PERSONAL_DATA =
  "The application does not collect or store any personal data. Users are identified by nicknames only.";
export const DATA_STORAGE_HEADER = "Data Storage";
export const DATA_STORAGE =
  "All data is stored on the Swarm network, a decentralized storage and distribution system, that is by design censorship-resistant and unstoppable. Content Filter An AI-assisted content filter is enabled by default to block content that may violate local laws and regulations. Users may disable this filter at their own discretion, but do so entirely at their own risk. Acceptance of Terms By using this application, you acknowledge that you have read, understood, and agree to be bound by the terms of this agreement. If you do not agree to these terms, do not use the application.";

export const CONTENT_FILTER_TEXT =
  "An AI-assisted content filter is enabled by default to block content that may violate local laws and regulations. Users may disable this filter at their own discretion, but do so entirely at their own risk.";

export const HOW_DOES_IT_WORK = "How does it work?";

export const COLLECTED_ALL = "You've collected all your points.";

export const GET_EXTRA = "For each active registration, you get an extra";

export const GET_YOUR_BZZ_TOKEN = "Get your BZZ token.";

export const CLAIM_REWARD = "Claim reward";

export const SHARE_REFERAL = "Share referal link";

export const POINTS = "Points";

export const GET_REFERAL_POINTS = "Get referal points";

export const MORE_POINTS = "more points";

export const GET_BZZ_TOKEN = "Get your BZZ token";

export const BZZ_TOKENS = "BZZ Tokens";
