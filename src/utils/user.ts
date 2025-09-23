import { PrivateKey } from "@ethersphere/bee-js";
import { keccak256 } from "ethers";

import { FIRST_NAMES, LAST_NAMES } from "../constants/names";

export interface UserSession {
  id: string;
  name: string;
  pubKey: string;
  privKey: string;
}

interface CookieOptions {
  expires?: Date;
  secure?: boolean;
  sameSite?: "strict";
  path?: string;
  domain?: string;
}

const COOKIE_NAME = "devcon_session";
// Set cookie to expire in ~68 years (effectively infinite)
const COOKIE_EXPIRY_INFINITE = 68 * 365 * 24 * 60 * 60 * 1000;

export const setCookie = (session: UserSession, options: CookieOptions = {}): void => {
  const { expires = new Date(Date.now() + COOKIE_EXPIRY_INFINITE), path = "/", domain, secure = true, sameSite = "strict" } = options;

  const cookieData = JSON.stringify(session);

  let cookieString = `${encodeURIComponent(COOKIE_NAME)}=${encodeURIComponent(cookieData)}`;

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  cookieString += `; path=${path}`;

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += "; secure";
  }

  cookieString += `; samesite=${sameSite}`;

  document.cookie = cookieString;
};

const getCookie = (name: string): string | null => {
  const nameEQ = encodeURIComponent(name) + "=";
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
};

const deleteCookie = (name: string, path: string = "/"): void => {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; secure; samesite=strict`;
};

export const loadUserSessionFromCookie = (): UserSession | null => {
  const cookieValue = getCookie(COOKIE_NAME);

  if (!cookieValue) {
    return null;
  }

  try {
    const session = JSON.parse(cookieValue);
    return session;
  } catch (error) {
    console.error("Failed to parse session cookie:", error);
    deleteCookie(COOKIE_NAME);
    return null;
  }
};

export const clearUserSessionCookie = (): void => {
  deleteCookie(COOKIE_NAME);
};

export const userLogin = (name: string): UserSession => {
  const id = crypto.randomUUID();

  const signer = getSigner(id);
  if (!signer) {
    throw new Error("Failed to generate signer");
  }

  const privKey = signer.toHex();
  const pubKey = signer.publicKey().address().toHex();

  const session: UserSession = {
    id,
    name,
    pubKey,
    privKey,
  };

  return session;
};

export const createMonogram = (name: string): string => {
  const initials = name.split(" ").map((n) => n[0]);
  return initials.join("").toUpperCase();
};

export const generateRandomUsername = (): string => {
  const randomFirstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const randomLastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${randomFirstName} ${randomLastName}`;
};

export const createUniqueUsername = (name: string, publicKey: string): string => {
  const cleanPubKey = publicKey.startsWith("0x") ? publicKey.slice(2) : publicKey;

  const keyIdentifier = cleanPubKey.slice(-6).toLowerCase();

  const part1 = keyIdentifier.slice(0, 3);
  const part2 = keyIdentifier.slice(3, 6);

  return `${name} ${part1}:${part2}`;
};

function getSigner(input: string): PrivateKey {
  const normalized = input.trim().toLowerCase();

  const hash = keccak256(Buffer.from(normalized, "utf-8"));

  const privateKeyHex = hash.slice(2);

  return new PrivateKey(privateKeyHex);
}
