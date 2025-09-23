import React from "react";
import { Link } from "react-router-dom";

import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import WelcomeProgressIndicator from "../../components/WelcomeProgressIndicator/WelcomeProgressIndicator";
import { ROUTES } from "../../constants/routes";

import "./Welcome3.scss";

const Welcome1: React.FC = () => {
  return (
    <>
      <div className="welcome-page welcome3-page">
        <div className="welcome-page__header">Experience the power of true decentalization</div>
        <div className="welcome-page__content">
          <div>
            Your data is stored on the censorship resistant and unstoppable <strong>Swarm network</strong>
          </div>
        </div>
        <div className="welcome-page__bottom">
          <div className="welcome-page__bottom-bottom">
            <WelcomeProgressIndicator active={2} />
            <div className="welcome-page_bottom-bottom__buttons">
              <Link to={ROUTES.WELCOME2} className="welcome-page__navigation-button-link">
                <WelcomeButton version="outlined">Back</WelcomeButton>
              </Link>
              <Link to={ROUTES.WELCOME4} className="welcome-page__navigation-button-link">
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
