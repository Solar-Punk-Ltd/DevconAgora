import React from "react";
import ReactDOM from "react-dom/client";
import MainRouter from "./MainRouter";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { GlobalStateProvider } from "./GlobalStateContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <MainRouter />
      </BrowserRouter>
    </GlobalStateProvider>
  </React.StrictMode>
);
