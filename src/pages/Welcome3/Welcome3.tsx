import React from "react";
import { Link } from "react-router-dom";
import "./Welcome3.scss";
import welcome3img from "../../assets/welcome3img.png";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import WelcomeProgressIndicator from "../../components/WelcomeProgressIndicator/WelcomeProgressIndicator";

const Welcome3: React.FC = () => {
  return (
    <>
      <div className="welcome-page">
        <div className="welcome-page__header">
          Decentralized Data Storage -
          <span style={{ color: "var(--purple-to-text-color)" }}> SWARM</span>
        </div>
        <div className="welcome-page__content">
          {/* <div className="welcome1-page__content__color-effect"></div> */}

          <div className="welcome-page__content__image">
            <img src={welcome3img} alt="" height="406px" />
          </div>
          <div className="welcome-page__content__text">
            Our data is stored on the <b>SWARM network</b>, ensuring security
            and reliability.
          </div>
        </div>
        <div className="welcome-page__bottom">
          <WelcomeProgressIndicator active={2} />
          <Link to="/welcome4">
            <WelcomeButton>Next</WelcomeButton>
          </Link>
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

export default Welcome3;
