import { useEffect } from "react";
import { Location, NavigateFunction } from "react-router-dom";

import { ROUTES } from "../utils/constants";
import { getLocalPrivateKey } from "../utils/helpers";

export const useRouteProtection = (location: Location, navigate: NavigateFunction) => {
  useEffect(() => {
    const privKey = getLocalPrivateKey();
    const noRedirectedPaths = [ROUTES.WELCOME1, ROUTES.WELCOME2, ROUTES.WELCOME3, ROUTES.WELCOME4, ROUTES.TACONBOARDING, ROUTES.PROFILECREATION];

    if (!privKey && !noRedirectedPaths.includes(location.pathname as ROUTES)) {
      navigate(ROUTES.APP);
    }
  }, [location.pathname, navigate]);
};
