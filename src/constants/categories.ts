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

export const LOBBY_TITLE = "BBW Lobby";
export const MOCK_START_TIME = new Date("2024-11-12T02:45:00.000Z");

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
