import { useCallback, useEffect } from "react";

import { useGlobalState } from "../contexts/global";
import { isUserRegistered } from "../utils/helpers";

export const fetchPoints = async (username: string, cb: (points: number) => void): Promise<void> => {
  try {
    if (isUserRegistered()) {
      const resp = await fetch(process.env.BACKEND_API_URL + "/points/" + username);
      const data = await resp.text();
      cb(Number(data));
    }
  } catch (error) {
    console.error("error fetching points: ", error);
  }
}

export const usePoints = () => {
  const { username, setPoints } = useGlobalState();

  const getPoints = useCallback(async () => {
    await fetchPoints(username, setPoints);
  }, [username, setPoints]);

  useEffect(() => {
    getPoints();
    const interval = setInterval(() => {
      getPoints();
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [getPoints]);

  return { getPoints };
};
