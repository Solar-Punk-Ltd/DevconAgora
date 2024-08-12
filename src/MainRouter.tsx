import { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import Welcome1 from "./pages/Welcome1/Welcome1";
import Welcome2 from "./pages/Welcome2/Welcome2";
import Welcome3 from "./pages/Welcome3/Welcome3";
import Welcome4 from "./pages/Welcome4/Welcome4";
import OpenProfile from "./pages/OpenProfile/OpenProfile";
import MainProfilePage from "./pages/MainProfilePage/MainProfilePage";

export enum ROUTES {
  APP = "/DevconAgora/",
  WELCOME1 = "/DevconAgora/welcome1",
  WELCOME2 = "/DevconAgora/welcome2",
  WELCOME3 = "/DevconAgora/welcome3",
  WELCOME4 = "/DevconAgora/welcome4",
  OPENPROFILE = "/DevconAgora/openprofile",
  MAINPROFILE = "/DevconAgora/mainprofile",
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
