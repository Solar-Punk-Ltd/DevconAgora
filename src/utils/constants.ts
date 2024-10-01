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


export const RESOURCE_IDS = new Map([
  ["Layer 2s", "null"],
  ["Core protocol", "null"],
  ["Cypherpunk and privacy", "null"],
  ["Usability", "null"],
  ["Real World Ethereum", "null"],
  ["Applied Cryptography", "null"],
  ["Cryptoeconomics", "null"],
  ["Coordination", "null"],
  ["Developer Experience", "null"],
  ["Security", "null"]
]);

export const TEST_RESOURCE_IDS = new Map([
  ["layer-2s-test", "null"],
  ["core-protocol-test", "null"],
  ["cypherpunk-and-privacy-test", "null"],
  ["usability-test", "null"],
  ["real-world-ethereum-test", "null"],
  ["applied-cryptography-test", "null"],
  ["cryptoeconomics-test", "null"],
  ["coordination-test", "null"],
  ["developer-experience-test", "null"],
  ["security-test", "null"]
]);

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

export const CATEGORY_NAMES_TO_ID_MAP = new Map([
  ["Layer 2s", "layer-2s"],
  ["Core protocol", "core-protocol"],
  ["Cypherpunk and privacy", "cypherpunk-and-privacy"],
  ["Usability", "usability"],
  ["Real World Ethereum", "real-world-ethereum"],
  ["Applied Cryptography", "applied-cryptography"],
  ["Cryptoeconomics", "cryptoeconomics"],
  ["Coordination", "coordination"],
  ["Developer Experience", "developer-experience"],
  ["Security", "security"],
]);

export const TEST_CATEGPRY_NAMES_TO_ID_MAP = new Map([
  ["Layer 2s::test", "layer-2s-test"],
  ["Core protocol::test", "core-protocol-test"],
  ["Cypherpunk and privacy::test", "cypherpunk-and-privacy-test"],
  ["Usability::test", "usability-test"],
  ["Real World Ethereum::test", "real-world-ethereum-test"],
  ["Applied Cryptography::test", "applied-cryptography-test"],
  ["Cryptoeconomics::test", "cryptoeconomics-test"],
  ["Coordination::test", "coordination-test"],
  ["Developer Experience::test", "developer-experience-test"],
  ["Security::test", "security-test"],
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
