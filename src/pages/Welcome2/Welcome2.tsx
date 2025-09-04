import React from "react";
import { Link } from "react-router-dom";

import WelcomeMask from "../../assets/welcome-glass-effect.png";
import welcome2img from "../../assets/welcome2img.png";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import WelcomeProgressIndicator from "../../components/WelcomeProgressIndicator/WelcomeProgressIndicator";
import { ROUTES } from "../../utils/constants";

const Welcome1: React.FC = () => {
  return (
    <>
      <div className="welcome-page grid">
        <div className="welcome-page__header">Share your thoughts</div>
        <div className="welcome-page__content">
          <div className="welcome-page__content__image">
            <img src={welcome2img} alt="" className="welcome-page__main-image" />
            <div className="welcome-page__effect">
              <img src={WelcomeMask} alt="" className="welcome-page__effect-mask" />
            </div>
          </div>
        </div>
        <div className="welcome-page__bottom">
          <div className="welcome-page__bottom__text">
            <div>Comment, start discussions and exchange ideas</div>
          </div>
          <div className="welcome-page__bottom-bottom">
            <WelcomeProgressIndicator active={1} />
            <div className="welcome-page_bottom-bottom__buttons">
              <Link to={ROUTES.WELCOME1} className="welcome-page__navigation-button-link">
                <WelcomeButton version="outlined">Back</WelcomeButton>
              </Link>
              <Link to={ROUTES.WELCOME3} className="welcome-page__navigation-button-link">
                <WelcomeButton version="filled">Next</WelcomeButton>
              </Link>
            </div>
            <div className="welcome-page__bottom-text">
              I know everything{" "}
              <Link to={ROUTES.TACONBOARDING}>
                <span className="welcome-page__bottom-text__skip">SKIP</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome1;
