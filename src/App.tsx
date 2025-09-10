import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { GlobalStateProvider } from "./contexts/global";
import { initializeFonts } from "./styles/fonts";
import MainRouter from "./router";

import "./styles/global.scss";

initializeFonts();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <BrowserRouter basename={process.env.ROUTER_BASENAME}>
        <MainRouter />
      </BrowserRouter>
    </GlobalStateProvider>
  </React.StrictMode>
);
