import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";

import { GlobalStateProvider } from "./contexts/global";
import { Provider as UserProvider } from "./contexts/user";
import MainRouter from "./router";

import "./styles/global.scss";

const isSwarm = process.env.SWARM === "true";

const Router = isSwarm ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div id="swarm-id-container" style={{
      position: "absolute",
      display: "none"
    }}></div>
    <GlobalStateProvider>
      <UserProvider>
        <Router basename={isSwarm ? undefined : process.env.ROUTER_BASENAME}>
          <MainRouter />
        </Router>
      </UserProvider>
    </GlobalStateProvider>
  </React.StrictMode>
);
