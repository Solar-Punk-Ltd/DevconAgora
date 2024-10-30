import React from "react";
import { Link } from "react-router-dom";
import welcome1img from "../../assets/welcome1img.png";
// import welcome1ColorEffectImg from "../../assets/welcome1-color-effect.png";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import WelcomeProgressIndicator from "../../components/WelcomeProgressIndicator/WelcomeProgressIndicator";
import WelcomeMask from "../../assets/welcome-glass-effect.png";
import { ROUTES } from "../../utils/constants";

const Welcome1: React.FC = () => {
  return (
    <>
      <div className="welcome-page">
        <div className="welcome-page__header">
          Privacy first communication platform
        </div>
        <div className="welcome-page__content">
          <div className="welcome-page__content__image">
            <img
              src={welcome1img}
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
            <div>Be part of the community without revealing your identity</div>
          </div>
          <div className="welcome-page__bottom-bottom">
            <WelcomeProgressIndicator active={0} />
            <div className="welcome-page_bottom-bottom__buttons">
              <Link
                to={ROUTES.WELCOME2}
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
