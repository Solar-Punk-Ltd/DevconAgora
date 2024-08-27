import React, { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import Welcome1 from "./pages/Welcome1/Welcome1";
import Welcome2 from "./pages/Welcome2/Welcome2";
import Welcome3 from "./pages/Welcome3/Welcome3";
import Welcome4 from "./pages/Welcome4/Welcome4";
import OpenProfile from "./pages/OpenProfile/OpenProfile";
import MainProfilePage from "./pages/MainProfilePage/MainProfilePage";
import Recent from "./pages/Recent/Recent";
import DevconLounge from "./pages/DevconLounge/DevconLounge";
import Profile from "./pages/Profile/Profile";
import Gamification from "./pages/Gamification/Gamification";

export enum ROUTES {
  APP = "/",
  WELCOME1 = "/welcome1",
  WELCOME2 = "/welcome2",
  WELCOME3 = "/welcome3",
  WELCOME4 = "/welcome4",
  OPENPROFILE = "/openprofile",
  MAINPROFILE = "/mainprofile",
  RECENT = "/recen",
  DEVCONLOUNGE = "/devconlounge",
  PROFILE = "/profile",
  GAMIFICATION = "/gamification",
}

const MainRouter = (): ReactElement => {
  return (
    <Routes>
      <Route path={ROUTES.APP} element={<App />} />
      <Route path={ROUTES.WELCOME1} element={<Welcome1 />} />
      <Route path={ROUTES.WELCOME2} element={<Welcome2 />} />
      <Route path={ROUTES.WELCOME3} element={<Welcome3 />} />
      <Route path={ROUTES.WELCOME4} element={<Welcome4 />} />
      <Route path={ROUTES.OPENPROFILE} element={<OpenProfile />} />
      <Route path={ROUTES.MAINPROFILE} element={<MainProfilePage />} />
      <Route path={ROUTES.RECENT} element={<Recent />} />
      <Route path={ROUTES.DEVCONLOUNGE} element={<DevconLounge />} />
      <Route path={ROUTES.PROFILE} element={<Profile />} />
      <Route path={ROUTES.GAMIFICATION} element={<Gamification />} />
    </Routes>
  );
};

export default MainRouter;
