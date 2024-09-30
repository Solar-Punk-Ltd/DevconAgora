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

export const TEST_CATEGORIES = [
  "Layer 2s::test",
  "Core protocol::test",
  "Cypherpunk and privacy::test",
  "Usability::test",
  "Real World Ethereum::test",
  "Applied Cryptography::test",
  "Cryptoeconomics::test",
  "Coordination::test",
  "Developer Experience::test",
  "Security::test",
] as const;

export type TestCategory = typeof TEST_CATEGORIES[number];  // Type is a union of the category strings

export const RESOURCE_IDS = {
  "Layer 2s":
    "1405000000000000000000000000000000000000000000000000000000000000",
  "Core protocol": "null",
  "Cypherpunk and privacy": "null",
  "Usability": "null",
  "Real World Ethereum": "null",
  "Applied Cryptography": "null",
  "Cryptoeconomics": "null",
  "Coordination": "null",
  "Developer Experience": "null",
  "Security": "null",
}

export const TEST_RESOURCE_IDS: Record<TestCategory, string> = {
  "Layer 2s::test": "2400000000000000000000000000000000000000000000000000000000000000",
  "Core protocol::test": "2311000000000000000000000000000000000000000000000000000000000000",
  "Cypherpunk and privacy::test": "ab09000000000000000000000000000000000000000000000000000000000000",
  "Usability::test": "e705000000000000000000000000000000000000000000000000000000000000",
  "Real World Ethereum::test": "1f0a000000000000000000000000000000000000000000000000000000000000",
  "Applied Cryptography::test": "6e09000000000000000000000000000000000000000000000000000000000000",
  "Cryptoeconomics::test": "0505000000000000000000000000000000000000000000000000000000000000",
  "Coordination::test": "9601000000000000000000000000000000000000000000000000000000000000",
  "Developer Experience::test": "1814000000000000000000000000000000000000000000000000000000000000",
  "Security::test": "e404000000000000000000000000000000000000000000000000000000000000",
}

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
