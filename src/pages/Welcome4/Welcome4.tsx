import React from "react";
import "./Welcome4.scss";
import { Link } from "react-router-dom";
import welcome4img from "../../assets/welcome4img.png";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import WelcomeProgressIndicator from "../../components/WelcomeProgressIndicator/WelcomeProgressIndicator";
import WelcomeMask from "../../assets/welcome-glass-effect.png";
import { ROUTES } from "../../utils/constants";

const Welcome1: React.FC = () => {
  return (
    <>
      <div className="welcome-page">
        <div className="welcome-page__header">
          Claim <br />
          <span style={{ color: "var(--purple-to-text-color)" }}>
            Your Reward
          </span>
        </div>
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
              Start commenting and you will get your 10 BZZ reward and all the
              info you need once you have collected 10 points.
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
