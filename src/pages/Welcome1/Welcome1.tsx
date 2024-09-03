import React from "react";
import { Link } from "react-router-dom";
import "./Welcome1.scss";
import welcome1img from "../../assets/welcome1img.png";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";

const Welcome1: React.FC = () => {
  return (
    <>
      <div className="welcome1-page">
        <div className="welcome1-page__header">
          Welcome to the{" "}
          <span style={{ color: "var(--purple-to-text-color)" }}>
            2024 DevCon&nbsp;
          </span>
          event
        </div>
        <div className="welcome1-page__content">
          <div className="welcome1-page__content__image">
            <img src={welcome1img} alt="" width="293px" />
          </div>
          <div className="welcome1-page__content__text">
            Be Part of the Ethereum Community Contribute of the Growth of the
            Ecosystem.
          </div>
        </div>
        <div>
          <Link to="/welcome2">
            <WelcomeButton>Next</WelcomeButton>
          </Link>
          <div className="welcome1-page__bottom-text">
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
