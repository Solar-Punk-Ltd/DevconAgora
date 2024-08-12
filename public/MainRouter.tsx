import React, { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import App from "../src/App";
import Welcome1 from "../src/pages/Welcome1/Welcome1";
import Welcome2 from "../src/pages/Welcome2/Welcome2";
import Welcome3 from "../src/pages/Welcome3/Welcome3";
import Welcome4 from "../src/pages/Welcome4/Welcome4";
import OpenProfile from "../src/pages/OpenProfile/OpenProfile";
import MainProfilePage from "../src/pages/MainProfilePage/MainProfilePage";

export enum ROUTES {
  APP = "/",
  WELCOME1 = "/welcome1",
  WELCOME2 = "/welcome2",
  WELCOME3 = "/welcome3",
  WELCOME4 = "/welcome4",
  OPENPROFILE = "/openprofile",
  MAINPROFILE = "/mainprofile",
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
    </Routes>
  );
};

export default MainRouter;
