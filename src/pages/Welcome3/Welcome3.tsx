import React from "react";
import { Link } from "react-router-dom";
import welcome3img from "../../assets/welcome3img.png";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import WelcomeProgressIndicator from "../../components/WelcomeProgressIndicator/WelcomeProgressIndicator";
import WelcomeMask from "../../assets/welcome-glass-effect.png";
import { ROUTES } from "../../utils/constants";

const Welcome1: React.FC = () => {
  return (
    <>
      <div className="welcome-page">
        <div className="welcome-page__header">
          Experience the power of true decentalization
        </div>
        <div className="welcome-page__content">
          <div className="welcome-page__content__image">
            <img
              src={welcome3img}
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
              Your data is stored on the censorship resistant and unstoppable{" "}
              <strong>Swarm network</strong>
            </div>
          </div>
          <div className="welcome-page__bottom-bottom">
            <WelcomeProgressIndicator active={2} />
            <div className="welcome-page_bottom-bottom__buttons">
              <Link
                to={ROUTES.WELCOME2}
                className="welcome-page__navigation-button-link"
              >
                <WelcomeButton version="outlined">Back</WelcomeButton>
              </Link>
              <Link
                to={ROUTES.WELCOME4}
                className="welcome-page__navigation-button-link"
              >
                <WelcomeButton version="filled">Next</WelcomeButton>
              </Link>
            </div>
            <div className="welcome-page__bottom-text">
              I know everything{" "}
              <Link to={ROUTES.PROFILECREATION}>
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
