import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import bySolarPunk from "./assets/by-solar-punk.png";
import backgroundVideo from "./assets/opening.mp4";
import videoGlassEffect from "./assets/video-glass-effect.png";
import { TEXTS } from "./constants/text";
import { ROUTES } from "./utils/constants";
import { isUserRegistered } from "./utils/helpers";

import "./App.css";
import "../src/styles/global.scss";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if user is already registered
      if (isUserRegistered()) {
        navigate(ROUTES.HOME);
      } else {
        navigate(ROUTES.WELCOME1);
      }
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
          <img src={videoGlassEffect} className="opening-page__video-glass-effect" />
        </div>
        <div style={{}} className="opening-page__text-layer">
          <div className="opening-page__header">
            <div>{TEXTS.APP_NAME}</div>

            <img src={bySolarPunk} alt="" height="30px" width="104px" />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
