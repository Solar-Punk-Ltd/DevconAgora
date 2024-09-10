import React from "react";
import { Link } from "react-router-dom";
import welcome1img from "../../assets/ob_1.png";
// import welcome1ColorEffectImg from "../../assets/welcome1-color-effect.png";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import WelcomeProgressIndicator from "../../components/WelcomeProgressIndicator/WelcomeProgressIndicator";
import WelcomeMask from "../../assets/welcome-glass-effect.png";

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

          <div className="welcome-page__content__image">
            <img src={welcome1img} alt="" height="150%" />
            <div className="welcome-page__effect">
              <img
                src={WelcomeMask}
                alt=""
                style={{
                  position: "absolute",
                  bottom: "-62px",
                  left: "0px",
                  width: "100%",
                  height: "65%",
                  zIndex: "-1",
                }}
              />
            </div>
          </div>
        </div>
        <div className="welcome-page__bottom">
          <div className="welcome-page__content__text">
            <div>
              Be Part of the Ethereum Community Contribute of the Growth of the
              Ecosystem.
            </div>
          </div>
          <div className="welcome-page__bottom-bottom">
            <WelcomeProgressIndicator active={0} />
            <Link to="/welcome2">
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
      </div>
    </>
  );
};

export default Welcome1;
