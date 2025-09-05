import { FeedIndex, NULL_ADDRESS, Reference } from "@ethersphere/bee-js";

import AppliedCryptography from "../assets/category-applied-cryptography.png";
import Coordination from "../assets/category-coordination.png";
import CoreProtocol from "../assets/category-core-protocol.png";
import CryptoEconomics from "../assets/category-crypto-economics.png";
import CypherpunkAndPrivacy from "../assets/category-cypherpunk-and-privacy.png";
import DeveloperExperience from "../assets/category-developer-experience.png";
import Entertainment from "../assets/category-entertainment.png";
import Layer2s from "../assets/category-layer-2s.png";
import RealWorldEthereum from "../assets/category-real-world-ethereum.png";
import Security from "../assets/category-security.png";
import Usability from "../assets/category-usability.png";

export const BATCH_ID_HEX_LENGTH = 64;
export const ADDRESS_HEX_LENGTH = 64;
export const FIVE_MINUTES = 1000 * 60 * 5;
export const FIVE_SECONDS = 5000;
export const DEFAULT_URL = "http://localhost:1633/";
export const DUMMY_STAMP = "f07a4b8b5a502edbf36cc1a4859b1ea54c0c6890068fb3bb80c681943f1f625d";
export const SELF_NOTE_TOPIC = "selfNoteTopics";
export const MOCK_START_TIME = new Date("2024-11-12T02:45:00.000Z");
export const MAX_PRELOADED_TALKS = 15;
export const MAX_COMMENTS_LOADED = 15n;
export const MAX_SESSIONS_SHOWN = 9;
export const LOBBY_TITLE = "BBW Lobby";
export const MAX_CHARACTER_COUNT = 4096;
export const SWARM_ZERO_ADDRESS = new Reference(NULL_ADDRESS);
export const FEED_INDEX_ZERO = FeedIndex.fromBigInt(0n);
export const RAW_FEED_TOPIC_SESSIONS = "sessions";
export const DEFAULT_POLL_INTERVAL_5_SECONDS = 5000;
export const SPACES_KEY = "spaces";

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
  // CONTENTFILTER = "/content-filter",
  TERMSANDCONDITIONS = "/terms-and-conditions",
  TACONBOARDING = "/terms-and-conditions-onboarding",
  NOTES = "/notes",
  NEW_NOTE = "/new",
  HOMEWITHGAMIFICATION = "/home-with-gamification",
}

export const CATEGORIES = ["Deeptech Day", "Kripteus Professional Day", "Swarm Decentralized AI Forum", "Polkadot Day 2025", LOBBY_TITLE];

export const DATE_TO_DEVCON_DAY = new Map([
  [new Date("2024-11-12").toDateString(), "Day 1"],
  [new Date("2024-11-13").toDateString(), "Day 2"],
  [new Date("2024-11-14").toDateString(), "Day 3"],
  [new Date("2024-11-15").toDateString(), "Day 4"],
]);

export const STAGES_MAP = new Map([["main-stage", "Main Stage"]]);

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
  ["Entertainment", Entertainment],
]);

export const DISCLAIMER_OF_LIABILITY_HEADER = "Disclaimer of Liability";
export const DISCLAIMER_OF_LIABILITY_TEXT =
  "The developer of this application shall not be held liable for any content shared, transmitted, or viewed within the application. Users are solely responsible for their actions, communications, and compliance with all applicable laws and regulations.";
export const PERSONAL_DATA_HEADER = "Personal Data";
export const PERSONAL_DATA_TEXT =
  "This application does not collect, process or store any personal data. Users are identified exclusively by self-selected nicknames.";
export const DATA_STORAGE_HEADER = "Data Storage";
export const DATA_STORAGE_TEXT =
  "All data is stored on the Swarm network, a decentralized storage and distribution system that is inherently censorship-resistant and designed to be unstoppable. Learn more about Swarm here: ";
export const DATA_STORAGE_LOCATION = "https://www.ethswarm.org/";

export const CONTENT_FILTER_TEXT =
  "An AI-assisted content filter is enabled by default to block content that may violate local laws and regulations. Users may disable this option at their own discretion, but do so entirely at their own risk.";

export const ACCEPTANCE_OF_TERMS_HEADER = "Acceptance of Terms";
export const ACCEPTANCE_OF_TERMS_TEXT =
  "By accessing or using this application, you acknowledge that you have read, understood and agreed to be bound by these terms. If you do not accept these terms, you must refrain from using the application.";

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

export const GIFTCODE_KEY = "giftcode";
