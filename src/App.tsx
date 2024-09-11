import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import "../src/styles/global.scss";

import backgroundVideo from "./assets/opening.mp4";
import bySolarPunk from "./assets/by-solar-punk.png";
import videoGlassEffect from "./assets/video-glass-effect.png";
import dc7Logo from "./assets/dc7.png";
import { TEXTS } from "../textConstants";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/welcome1");
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);
  return (
    <>
      <div className="opening-page">
        <video autoPlay muted loop className="opening-page__video-background">
          <source src={backgroundVideo} type="video/mp4" />
        </video>
        <div>
          <img
            src={videoGlassEffect}
            className="opening-page__video-glass-effect"
          />
        </div>
        <div style={{}} className="opening-page__text-layer">
          <div className="opening-page__header">
            <div>{TEXTS.APP_NAME}</div>

            <img src={bySolarPunk} alt="" height="30px" width="104px" />
          </div>
          <div className="opening-page__footer">
            <img src={dc7Logo} alt="" height="57px" width="160px" />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
