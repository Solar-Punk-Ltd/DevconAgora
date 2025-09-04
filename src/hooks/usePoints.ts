import { useCallback, useEffect } from "react";

import { useGlobalState } from "../contexts/global";
import { isUserRegistered } from "../utils/helpers";

export const usePoints = () => {
  const { username, setPoints } = useGlobalState();

  const getPoints = useCallback(async () => {
    try {
      if (isUserRegistered()) {
        const resp = await fetch(process.env.BACKEND_API_URL + "/points/" + username);
        const data = await resp.text();
        setPoints(Number(data));
      }
    } catch (error) {
      console.error("error fetching points: ", error);
    }
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
