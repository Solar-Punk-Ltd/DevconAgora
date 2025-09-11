import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, BrowserRouter } from "react-router-dom";

import { GlobalStateProvider } from "./contexts/global";
import { initializeFonts } from "./styles/fonts";
import MainRouter from "./router";

import "./styles/global.scss";

initializeFonts();

const Router = process.env.SWARM === "true" ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <Router basename={process.env.SWARM === "true" ? undefined : process.env.ROUTER_BASENAME}>
        <MainRouter />
      </Router>
    </GlobalStateProvider>
  </React.StrictMode>
);
