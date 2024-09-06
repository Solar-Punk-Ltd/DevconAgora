import React from "react";
import { Link } from "react-router-dom";
import welcome1img from "../../assets/welcome1img.png";
import welcome1mask from "../../assets/welcome1mask.png";
// import welcome1ColorEffectImg from "../../assets/welcome1-color-effect.png";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import WelcomeProgressIndicator from "../../components/WelcomeProgressIndicator/WelcomeProgressIndicator";

const Welcome1: React.FC = () => {
  return (
    <>
      <div className="welcome-page">
        <div className="welcome-page__header">
          Welcome to the{" "}
          <span style={{ color: "var(--purple-to-text-color)" }}>
            2024 DevCon&nbsp;
          </span>
          event
        </div>
        <div className="welcome-page__content">
          {/* <div className="welcome1-page__content__color-effect"></div> */}

          <div
            className="welcome-page__content__image"
            style={{ position: "relative" }}
          >
            <div
              style={{ position: "absolute", bottom: "0px", display: "flex" }}
            >
              <img src={welcome1mask} alt="" width="100%" />
            </div>
            <div></div>
            <img src={welcome1img} alt="" width="293px" />
          </div>
          <div className="welcome-page__content__text">
            Be Part of the Ethereum Community Contribute of the Growth of the
            Ecosystem.
          </div>
        </div>
        <div className="welcome-page__bottom">
          <WelcomeProgressIndicator active={0} />
          <div className="welcome-page-buttons">
            <Link to="/welcome2" style={{ flex: "1 1 0" }}>
              <WelcomeButton version="filled">Next</WelcomeButton>
            </Link>
          </div>
          <div className="welcome-page__bottom-text">
            I know everything{" "}
            <Link to="/openprofile">
              <span
                style={{
                  textDecoration: "underline",
                  fontWeight: "bold",
                  color: "#8C72AE",
                }}
              >
                SKIP
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome1;
