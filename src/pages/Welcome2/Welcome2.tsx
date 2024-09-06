import React from "react";
import { Link } from "react-router-dom";
import welcome2img from "../../assets/welcome2img.png";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import WelcomeProgressIndicator from "../../components/WelcomeProgressIndicator/WelcomeProgressIndicator";

const Welcome2: React.FC = () => {
  return (
    <>
      <div className="welcome-page">
        <div className="welcome-page__header">
          Be active and get
          <span style={{ color: "var(--purple-to-text-color)" }}> reward!</span>
        </div>
        <div className="welcome-page__content">
          {/* <div className="welcome1-page__content__color-effect"></div> */}

          <div className="welcome-page__content__image">
            <img src={welcome2img} alt="" width="293px" />
          </div>
          <div className="welcome-page__content__text">
            Comment and contribute to the community. Receive{" "}
            <b>10 BZZ tokens</b> for 10 valuable contributions.
          </div>
        </div>
        <div className="welcome-page__bottom">
          <WelcomeProgressIndicator active={1} />
          <div className="welcome-page-buttons">
            <Link to="/welcome1" style={{ flex: "1 1 0" }}>
              <WelcomeButton version="outlined">Back</WelcomeButton>
            </Link>
            <Link to="/welcome3" style={{ flex: "1 1 0" }}>
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

export default Welcome2;
