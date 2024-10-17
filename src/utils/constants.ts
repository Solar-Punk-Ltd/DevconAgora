export const BATCH_ID_HEX_LENGTH = 64;
export const ADDRESS_HEX_LENGTH = 64;
export const FIVE_MINUTES = 1000 * 60 * 5;
export const FEEDTYPE_SEQUENCE = "sequence";
export const DEFAULT_URL = "http://localhost:1633/";
export const DUMMY_STAMP =
  "f07a4b8b5a502edbf36cc1a4859b1ea54c0c6890068fb3bb80c681943f1f625d";
export const SELF_NOTE_TOPIC = "selfNoteTopics";
export const MOCK_START_TIME = new Date("2022-10-11T12:15:00.000Z");
export const MAX_PRELOADED_TALKS = 11;
export const MAX_COMMENTS_LOADED = 15;
export const MAX_SESSIONS_SHOWN = 9;
export const LOBBY_TOPIC = "lobby::test";
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
  DEVCONLOUNGE = "/devconlounge",
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
}

export const CATEGORIES = [
  "Layer 2s",
  "Core Protocol",
  "Cypherpunk & Privacy",
  "Usability",
  "Real World Ethereum",
  "Applied Cryptography",
  "Cryptoeconomics",
  "Coordination",
  "Developer Experience",
  "Security",
];

// TODO: match category names and resource ids with the actual categories
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
  ["Security", "null"],
]);

export const TEST_RESOURCE_IDS = new Map([
  [
    "layer-2s-test",
    "9804000000000000000000000000000000000000000000000000000000000000",
  ],
  [
    "core-protocol-test",
    "f103000000000000000000000000000000000000000000000000000000000000",
  ],
  [
    "cypherpunk-and-privacy-test",
    "7a02000000000000000000000000000000000000000000000000000000000000",
  ],
  [
    "usability-test",
    "6305000000000000000000000000000000000000000000000000000000000000",
  ],
  [
    "real-world-ethereum-test",
    "7d13000000000000000000000000000000000000000000000000000000000000",
  ],
  [
    "applied-cryptography-test",
    "a50c000000000000000000000000000000000000000000000000000000000000",
  ],
  [
    "cryptoeconomics-test",
    "d900000000000000000000000000000000000000000000000000000000000000",
  ],
  [
    "coordination-test",
    "d109000000000000000000000000000000000000000000000000000000000000",
  ],
  [
    "developer-experience-test",
    "0a01000000000000000000000000000000000000000000000000000000000000",
  ],
  [
    "security-test",
    "7302000000000000000000000000000000000000000000000000000000000000",
  ],
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

export const CATEGORY_IMAGES_MAP = new Map([
  ["Layer 2s::test", Layer2s],
  ["Core protocol::test", CoreProtocol],
  ["Cypherpunk and privacy::test", CypherpunkAndPrivacy],
  ["Usability::test", Usability],
  ["Real World Ethereum::test", RealWorldEthereum],
  ["Applied Cryptography::test", AppliedCryptography],
  ["Cryptoeconomics::test", CryptoEconomics],
  ["Coordination::test", Coordination],
  ["Developer Experience::test", DeveloperExperience],
  ["Security::test", Security],
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
