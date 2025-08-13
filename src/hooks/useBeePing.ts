import { useCallback, useEffect, useState } from "react";

import { FIVE_MINUTES } from "../utils/constants";

export const useBeePing = () => {
  const [isBeeRunning, setBeeRunning] = useState<boolean>(false);

  const beeUrl = process.env.BEE_API_URL;

  const checkBee = useCallback(
    async (url: string) => {
      try {
        await fetch(url + "/bytes/" + process.env.HEALTH_CHECK_DATA_REF);
        if (!isBeeRunning) {
          setBeeRunning(true);
          console.debug("Bee is running");
        }
      } catch (error) {
        if (isBeeRunning) {
          setBeeRunning(false);
          console.error("Bee stopped running, error: ", error);
        }
      }
    },
    [] // Note: isBeeRunning intentionally excluded from deps to avoid infinite loop
  );

  useEffect(() => {
    if (!beeUrl) {
      console.error("BEE API URL is not configured.");
      return;
    }

    checkBee(beeUrl);
    const interval = setInterval(() => {
      checkBee(beeUrl);
    }, FIVE_MINUTES);
    return () => clearInterval(interval);
  }, [checkBee, beeUrl]);

  return { isBeeRunning };
};
