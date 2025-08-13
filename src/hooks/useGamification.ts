import { useEffect, useState } from "react";

import { useGlobalState } from "../contexts/global";

export const useGamification = () => {
  const { points, setShowGamification } = useGlobalState();
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    } else {
      if (points === 1 || points === 5 || points === 10) {
        setShowGamification(true);
      }
    }
  }, [points, isFirstRender, setShowGamification]);

  return { isFirstRender };
};
