import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";

import { GlobalStateProvider } from "./contexts/global";
import { Provider as UserProvider } from "./contexts/user";
import { initializeFonts } from "./styles/fonts";
import MainRouter from "./router";

import "./styles/global.scss";

initializeFonts();

const Router = process.env.SWARM === "true" ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <UserProvider>
        <Router basename={process.env.SWARM === "true" ? undefined : process.env.ROUTER_BASENAME}>
          <MainRouter />
        </Router>
      </UserProvider>
    </GlobalStateProvider>
  </React.StrictMode>
);
