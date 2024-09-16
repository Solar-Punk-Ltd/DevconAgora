import React, { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import Welcome1 from "./pages/Welcome1/Welcome1";
import Welcome2 from "./pages/Welcome2/Welcome2";
import Welcome3 from "./pages/Welcome3/Welcome3";
import Welcome4 from "./pages/Welcome4/Welcome4";
import ProfileCreation from "./pages/ProfileCreation/ProfileCreation";
import HomePage from "./pages/HomePage/HomePage";
import Recent from "./pages/Recent/Recent";
import DevconLounge from "./pages/DevconLounge/DevconLounge";
import Profile from "./pages/Profile/Profile";
import Gamification from "./components/Gamification/Gamification";
import Agenda from "./pages/Agenda/Agenda";
import Test from "./pages/Test/Test";

export enum ROUTES {
  APP = "/",
  WELCOME1 = "/welcome1",
  WELCOME2 = "/welcome2",
  WELCOME3 = "/welcome3",
  WELCOME4 = "/welcome4",
  PROFILECREATION = "/profilecreation",
  HOME = "/home",
  RECENT = "/recent",
  DEVCONLOUNGE = "/devconlounge",
  PROFILE = "/profile",
  GAMIFICATION = "/gamification",
  AGENDA = "/agenda",
  TEST = "/test",
}

const MainRouter = (): ReactElement => {
  return (
    <Routes>
      <Route path={ROUTES.APP} element={<App />} />
      <Route path={ROUTES.WELCOME1} element={<Welcome1 />} />
      <Route path={ROUTES.WELCOME2} element={<Welcome2 />} />
      <Route path={ROUTES.WELCOME3} element={<Welcome3 />} />
      <Route path={ROUTES.WELCOME4} element={<Welcome4 />} />
      <Route path={ROUTES.PROFILECREATION} element={<ProfileCreation />} />
      <Route path={ROUTES.HOME} element={<HomePage isLoaded={false} />} />
      <Route path={ROUTES.RECENT} element={<Recent />} />
      <Route path={ROUTES.DEVCONLOUNGE} element={<DevconLounge />} />
      <Route path={ROUTES.PROFILE} element={<Profile />} />
      <Route path={ROUTES.GAMIFICATION} element={<Gamification />} />
      <Route path={ROUTES.AGENDA} element={<Agenda />} />
      <Route path={ROUTES.AGENDA} element={<Agenda />} />
      <Route path={ROUTES.TEST} element={<Test />} />
    </Routes>
  );
};

export default MainRouter;
