import { useEffect, useState } from "react";
import { Location } from "react-router-dom";

export const usePrevLocation = (location: Location) => {
  const [prevLocation, setPrevLocation] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      setPrevLocation(location.pathname);
    };
  }, [location]);

  return { prevLocation };
};
