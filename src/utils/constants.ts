const createBiDirectionaltMap = (map: Map<string, string>) => {
  const biDirectionalMap = new Map();

  map.forEach((value: string, key: string) => {
    biDirectionalMap.set(key, value);
    biDirectionalMap.set(value, key);
  });

  return biDirectionalMap;
};

export const BATCH_ID_HEX_LENGTH = 64;
export const ADDRESS_HEX_LENGTH = 64;
export const FIVE_MINUTES = 1000 * 60 * 5;
export const FEEDTYPE_SEQUENCE = "sequence";
export const DEFAULT_URL = "http://localhost:1633/";
export const DUMMY_STAMP =
  "f07a4b8b5a502edbf36cc1a4859b1ea54c0c6890068fb3bb80c681943f1f625d";
export const SELF_NOTE_TOPIC = "selfNoteTopics";
export const MOCK_START_TIME = new Date("2024-11-12T02:45:00.000Z");
export const MAX_PRELOADED_TALKS = 11;
export const MAX_COMMENTS_LOADED = 15;
export const MAX_SESSIONS_SHOWN = 9;
export const LOBBY_TITLE = "Lobby";
export const MAX_CHARACTER_COUNT = 4096;

import Layer2s from "../assets/category-layer-2s.png";
import RealWorldEthereum from "../assets/category-real-world-ethereum.png";
import Security from "../assets/category-security.png";
import Usability from "../assets/category-usability.png";
import DeveloperExperience from "../assets/category-developer-experience.png";
import CypherpunkAndPrivacy from "../assets/category-cypherpunk-and-privacy.png";
import CryptoEconomics from "../assets/category-crypto-economics.png";
import CoreProtocol from "../assets/category-core-protocol.png";
import Coordination from "../assets/category-coordination.png";
import AppliedCryptography from "../assets/category-applied-cryptography.png";

export enum ROUTES {
  APP = "/",
  WELCOME1 = "/welcome1",
  WELCOME2 = "/welcome2",
  WELCOME3 = "/welcome3",
  WELCOME4 = "/welcome4",
  PROFILECREATION = "/profilecreation",
  HOME = "/home",
  PROFILE = "/profile",
  GAMIFICATION = "/gamification",
  AGENDA = "/agenda",
  CATEGORIES = "/categories",
  SPACES = "/spaces",
  HOWDOESITWORK = "/how-does-it-work",
  TALKS = "/talks",
  CLAIMREWARD = "/claim-reward",
  CONTENTFILTER = "/content-filter",
  TERMSANDCONDITIONS = "/terms-and-conditions",
  TACONBOARDING = "/terms-and-conditions-onboarding",
  NOTES = "/notes",
  NEW_NOTE = "/new",
  STAYUPDATED = "/stay-updated",
  HOMEWITHGAMIFICATION = "/home-with-gamification",
}

export const CATEGORIES = [
  "Layer 2",
  "Core Protocol",
  "Cypherpunk & Privacy",
  "Usability",
  "Real World Ethereum",
  "Applied Cryptography",
  "Cryptoeconomics",
  "Coordination",
  "Developer Experience",
  "Security",
  "Entertainment",
];

export const RESOURCE_IDS = new Map([
  [
    "layer-2s",
    "3503000000000000000000000000000000000000000000000000000000000000",
  ],
  [
    "core-protocol",
    "b303000000000000000000000000000000000000000000000000000000000000",
  ],
  [
    "cypherpunk-and-privacy",
    "4f08000000000000000000000000000000000000000000000000000000000000",
  ],
  [
    "usability",
    "3109000000000000000000000000000000000000000000000000000000000000",
  ],
  [
    "real-world-ethereum",
    "8108000000000000000000000000000000000000000000000000000000000000",
  ],
  [
    "applied-cryptography",
    "ee01000000000000000000000000000000000000000000000000000000000000",
  ],
  [
    "cryptoeconomics",
    "880d000000000000000000000000000000000000000000000000000000000000",
  ],
  [
    "coordination",
    "6400000000000000000000000000000000000000000000000000000000000000",
  ],
  [
    "developer-experience",
    "3301000000000000000000000000000000000000000000000000000000000000",
  ],
  [
    "security",
    "b30a000000000000000000000000000000000000000000000000000000000000",
  ],
  ["lobby", "000"],
]);

export const DATE_TO_DEVCON_DAY = new Map([
  [new Date("2024-11-12").toDateString(), "Day 1"],
  [new Date("2024-11-13").toDateString(), "Day 2"],
  [new Date("2024-11-14").toDateString(), "Day 3"],
  [new Date("2024-11-15").toDateString(), "Day 4"],
]);

export const STAGES_MAP = new Map([
  ["stage-1", "Stage 1"],
  ["stage-2", "Stage 2"],
  ["stage-3", "Stage 3"],
  ["stage-4", "Stage 4"],
  ["stage-5", "Stage 5"],
  ["stage-6", "Stage 6"],
  ["breakout-1", "Breakout 1"],
  ["breakout-2", "Breakout 2"],
  ["breakout-3", "Breakout 3"],
  ["classroom-a", "Classroom A"],
  ["classroom-b", "Classroom B"],
  ["classroom-c", "Classroom C"],
  ["classroom-d", "Classroom D"],
  ["classroom-e", "Classroom E"],
  ["decompression-room", "Decompression Room"],
  // ["keynote", "Keynote"], // not used
  ["main-stage", "Main Stage"],
  ["music-stage", "Music stage"],
  ["all", "All"],
]);

const oneDirectionCategoryNamesToIdMap = new Map([
  ["Layer 2", "layer-2s"],
  ["Core Protocol", "core-protocol"],
  ["Cypherpunk & Privacy", "cypherpunk-and-privacy"],
  ["Usability", "usability"],
  ["Real World Ethereum", "real-world-ethereum"],
  ["Applied Cryptography", "applied-cryptography"],
  ["Cryptoeconomics", "cryptoeconomics"],
  ["Coordination", "coordination"],
  ["Developer Experience", "developer-experience"],
  ["Security", "security"],
  ["Lobby", "lobby"],
  ["Entertainment", "entertainment"],
]);
export const CATEGORY_NAMES_TO_ID_MAP = createBiDirectionaltMap(
  oneDirectionCategoryNamesToIdMap
);

export const CATEGORY_IMAGES_MAP = new Map([
  ["Layer 2", Layer2s],
  ["Core Protocol", CoreProtocol],
  ["Cypherpunk & Privacy", CypherpunkAndPrivacy],
  ["Usability", Usability],
  ["Real World Ethereum", RealWorldEthereum],
  ["Applied Cryptography", AppliedCryptography],
  ["Cryptoeconomics", CryptoEconomics],
  ["Coordination", Coordination],
  ["Developer Experience", DeveloperExperience],
  ["Security", Security],
  ["Entertainment", "entertainment"],
]);

export const DISCLAIMER_OF_LIABILITY_HEADER = "Disclaimer of Liability";
export const DISCLAIMER_OF_LIABILITY_TEXT =
  "The developer of this application disclaims any liability for content shared or viewed within the app. Users are solely responsible for their actions and communications and should comply with all applicable laws and regulations.";
export const PERSONAL_DATA_HEADER = "Personal Data";
export const PERSONAL_DATA_TEXT =
  "The application does not collect or store any personal data. Users are identified by nicknames only.";
export const DATA_STORAGE_HEADER = "Data Storage";
export const DATA_STORAGE_TEXT =
  "All data is stored on the Swarm network, a decentralized storage and distribution system, that is by design censorship-resistant and unstoppable. Content Filter An AI-assisted content filter is enabled by default to block content that may violate local laws and regulations. Users may disable this filter at their own discretion, but do so entirely at their own risk. Acceptance of Terms By using this application, you acknowledge that you have read, understood, and agree to be bound by the terms of this agreement. If you do not agree to these terms, do not use the application.";

export const CONTENT_FILTER_HEADER = "Content Filter";
export const CONTENT_FILTER_TEXT =
  "An AI-assisted content filter is enabled by default to block content that may violate local laws and regulations. Users may disable this filter at their own discretion, but do so entirely at their own risk.";

export const ACCEPTANCE_OF_TERMS_HEADER = "Acceptance of Terms";
export const ACCEPTANCE_OF_TERMS_TEXT =
  "By using this application, you acknowledge that you have read, understood, and agree to be bound by the terms of this agreement. If you do not agree to these terms, do not use the application.";

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
