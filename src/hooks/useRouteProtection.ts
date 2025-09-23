import { useEffect } from "react";
import { Location, NavigateFunction } from "react-router-dom";

import { ROUTES } from "../constants/routes";
import { useUserContext } from "@/contexts/user";

export const useRouteProtection = (location: Location, navigate: NavigateFunction) => {
  const { isUserLoggedIn } = useUserContext();

  useEffect(() => {
    const noRedirectedPaths = [ROUTES.WELCOME1, ROUTES.WELCOME2, ROUTES.WELCOME3, ROUTES.WELCOME4, ROUTES.TACONBOARDING, ROUTES.PROFILECREATION];

    if (!isUserLoggedIn && !noRedirectedPaths.includes(location.pathname as ROUTES)) {
      navigate(ROUTES.APP);
    }
  }, [location.pathname, navigate]);
};
