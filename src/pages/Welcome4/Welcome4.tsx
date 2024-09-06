import React from "react";
import { Link } from "react-router-dom";
import "./Welcome4.scss";
import welcome4img from "../../assets/welcome4img.png";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import WelcomeProgressIndicator from "../../components/WelcomeProgressIndicator/WelcomeProgressIndicator";

const Welcome4: React.FC = () => {
  return (
    <>
      <div className="welcome-page">
        <div className="welcome-page__header">
          Claim
          <div>
            <span style={{ color: "var(--purple-to-text-color)" }}>
              {" "}
              Your Reward
            </span>
          </div>
        </div>
        <div className="welcome-page__content">
          {/* <div className="welcome1-page__content__color-effect"></div> */}
          <div></div>
          <div className="welcome-page__content__image">
            <img src={welcome4img} alt="" height="406px" />
          </div>
          <div className="welcome-page__content__text">
            You can <b>claim your reward </b>
            at the SWARM booth.
          </div>
        </div>
        <div className="welcome-page__bottom">
          <WelcomeProgressIndicator active={3} />
          <div className="welcome-page-buttons">
            <Link to="/welcome3" style={{ flex: "1 1 0" }}>
              <WelcomeButton version="outlined">Back</WelcomeButton>
            </Link>
            <Link to="/openprofile" style={{ flex: "1 1 0" }}>
              <WelcomeButton version="filled">Let’s go</WelcomeButton>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome4;
