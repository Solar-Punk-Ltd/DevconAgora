import React from "react";
import { Link } from "react-router-dom";

import WelcomeMask from "../../assets/welcome-glass-effect.png";
import welcome4img from "../../assets/welcome4img.png";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import WelcomeProgressIndicator from "../../components/WelcomeProgressIndicator/WelcomeProgressIndicator";
import { ROUTES } from "../../utils/constants";

import "./Welcome4.scss";

const Welcome1: React.FC = () => {
  return (
    <>
      <div className="welcome-page">
        <div className="welcome-page__header">Stay with Swarm</div>
        <div className="welcome-page__content">
          <div className="welcome-page__content__image">
            <img
              src={welcome4img}
              alt=""
              className="welcome-page__main-image"
            />
            <div className="welcome-page__effect">
              <img
                src={WelcomeMask}
                alt=""
                className="welcome-page__effect-mask"
              />
            </div>
          </div>
        </div>
        <div className="welcome-page__bottom">
          <div className="welcome-page__bottom__text">
            <div>
              With your magic code you can start your own node the easiest way
              possible
            </div>
          </div>
          <div className="welcome-page__bottom-bottom">
            <WelcomeProgressIndicator active={3} />
            <div className="welcome-page_bottom-bottom__buttons welcome4-bottom">
              <Link
                to={ROUTES.WELCOME3}
                className="welcome-page__navigation-button-link"
              >
                <WelcomeButton version="outlined">Back</WelcomeButton>
              </Link>
              <Link
                to={ROUTES.TACONBOARDING}
                className="welcome-page__navigation-button-link"
              >
                <WelcomeButton version="filled">Next</WelcomeButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome1;
