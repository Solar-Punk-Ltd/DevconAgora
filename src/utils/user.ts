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
  sameSite?: "strict" | "lax" | "none";
  path?: string;
  domain?: string;
}

const SESSION_KEY = "devcon_session";
// Set cookie to expire in ~68 years (effectively infinite)
const COOKIE_EXPIRY_INFINITE = 68 * 365 * 24 * 60 * 60 * 1000;

const attemptSetCookie = async (session: UserSession, options: CookieOptions = {}): Promise<boolean> => {
  const isHTTPS = window.location.protocol === "https:";

  //  Try more permissive settings if on problematic gateways
  const strategies = [
    // Strategy 0: Strict sameSite, secure if HTTPS
    { sameSite: "strict" as const, secure: isHTTPS },
    // Strategy 1: Lax sameSite, no domain
    { sameSite: "lax" as const, secure: isHTTPS },
    // Strategy 2: None sameSite (requires secure)
    { sameSite: "none" as const, secure: true },
    // Strategy 3: No sameSite attribute (legacy mode)
    { sameSite: undefined, secure: isHTTPS },
  ];

  for (const strategy of strategies) {
    try {
      const {
        expires = new Date(Date.now() + COOKIE_EXPIRY_INFINITE),
        path = "/",
        domain, // Never set domain for problematic gateways
        ...strategyOptions
      } = { ...options, ...strategy };

      const cookieData = JSON.stringify(session);
      let cookieString = `${encodeURIComponent(SESSION_KEY)}=${encodeURIComponent(cookieData)}`;

      if (expires) {
        cookieString += `; expires=${expires.toUTCString()}`;
      }

      cookieString += `; path=${path}`;

      if (domain) {
        cookieString += `; domain=${domain}`;
      }

      if (strategyOptions.secure) {
        cookieString += "; secure";
      }

      if (strategyOptions.sameSite) {
        cookieString += `; samesite=${strategyOptions.sameSite}`;
      }

      document.cookie = cookieString;

      // Delay to allow browser to process the cookie
      await new Promise((resolve) => setTimeout(resolve, 200));

      const verification = getCookie(SESSION_KEY);
      if (verification) {
        return true;
      }
    } catch (error) {
      console.warn("Cookie strategy failed:", error);
    }
  }

  return false;
};

export const persistUserSession = async (session: UserSession, options: CookieOptions = {}): Promise<void> => {
  const cookieSuccess = await attemptSetCookie(session, options);

  if (!cookieSuccess) {
    console.log("Cookie setting failed, falling back to localStorage");

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      console.log("Session saved to localStorage");
    } catch (error) {
      console.error("Both cookie and localStorage failed:", error);
    }
  }
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
  // Try multiple deletion strategies for problematic gateways
  const strategies = [
    `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`,
    `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; secure`,
    `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; secure; samesite=lax`,
    `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; secure; samesite=none`,
  ];

  for (const strategy of strategies) {
    document.cookie = strategy;
  }
};

export const restoreUserSession = (): UserSession | null => {
  const cookieValue = getCookie(SESSION_KEY);

  if (cookieValue) {
    try {
      const session = JSON.parse(cookieValue);
      console.log("Session loaded from cookie");
      return session;
    } catch (error) {
      console.error("Failed to parse session cookie:", error);
      deleteCookie(SESSION_KEY);
    }
  }

  try {
    const storedValue = localStorage.getItem(SESSION_KEY);
    if (storedValue) {
      const session = JSON.parse(storedValue);
      console.log("Session loaded from localStorage");
      return session;
    }
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
  }

  return null;
};

export const purgeUserSession = (): void => {
  deleteCookie(SESSION_KEY);

  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }

  console.log("Session cleared from all storage methods");
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
