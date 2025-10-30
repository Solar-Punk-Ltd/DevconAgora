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
  const isEnsGateway = window.location.hostname.includes("eth.link") || window.location.hostname.includes("eth.limo");
  let cookieSuccess = false;

  if (!isEnsGateway) {
    cookieSuccess = await attemptSetCookie(session, options);
  }

  if (!cookieSuccess) {
    console.log("Cookie setting failed, falling back to localStorage");

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.debug("Both cookie and localStorage failed:", error);
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
  const isEnsGateway = window.location.hostname.includes("eth.link") || window.location.hostname.includes("eth.limo");

  if (!isEnsGateway) {
    const cookieValue = getCookie(SESSION_KEY);

    if (cookieValue) {
      try {
        const session = JSON.parse(cookieValue);
        return session;
      } catch (error) {
        console.debug("Failed to parse session cookie:", error);
        deleteCookie(SESSION_KEY);
      }
    }
  }

  try {
    const storedValue = localStorage.getItem(SESSION_KEY);
    if (storedValue) {
      const session = JSON.parse(storedValue);
      return session;
    }
  } catch (error) {
    console.debug("Failed to load from localStorage:", error);
  }

  return null;
};

export const purgeUserSession = (): void => {
  deleteCookie(SESSION_KEY);

  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.debug("Failed to clear localStorage:", error);
  }

  console.log("Session cleared from all storage methods");
};

// Generated fallback
const generateSecureId = (): string => {
  try {
    // Próbáljuk a modern crypto.randomUUID() API-t
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch (error) {
    console.warn("crypto.randomUUID() not available, using fallback");
  }

  try {
    // Próbáljuk a crypto.getRandomValues() API-t
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);

      // UUID v4 formátum generálása
      array[6] = (array[6] & 0x0f) | 0x40; // Version 4
      array[8] = (array[8] & 0x3f) | 0x80; // Variant bits

      const hex = Array.from(array)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
    }
  } catch (error) {
    console.warn("crypto.getRandomValues() not available, using fallback");
  }

  // Fallback Math.random() használatával
  console.warn("Using Math.random() fallback for ID generation");
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
// fallback end
export const userLogin = (name: string): UserSession => {
  // Generated fallback
  // origin: const id = crypto.randomUUID();

  // Generated fallback
  const id = generateSecureId();
  // fallback end
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

// Generated fallback
const getSecureRandom = (max: number): number => {
  try {
    // Próbáljuk a crypto.getRandomValues() API-t
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return array[0] % max;
    }
  } catch (error) {
    console.warn("crypto.getRandomValues() not available for random selection, using Math.random()");
  }

  // Fallback Math.random() használatával
  return Math.floor(Math.random() * max);
};
// fallback end
export const generateRandomUsername = (): string => {
  // Generated fallbac k origin:
  const randomFirstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const randomLastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${randomFirstName} ${randomLastName}`;

  // Generated fallback
  try {
    const randomFirstName = FIRST_NAMES[getSecureRandom(FIRST_NAMES.length)];
    const randomLastName = LAST_NAMES[getSecureRandom(LAST_NAMES.length)];
    return `${randomFirstName} ${randomLastName}`;
  } catch (error) {
    console.error("Failed to generate random username:", error);
    // Ultimate fallback
    return `User ${Math.floor(Math.random() * 10000)}`;
  }
};
// fallback end
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
