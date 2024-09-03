import React from "react";
import { Link } from "react-router-dom";
import "./Welcome2.scss";
import welcome2img from "../../assets/welcome2img.png";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";

const Welcome2: React.FC = () => {
  return (
    <>
      <div className="welcome2-page">
        <div className="welcome2-page__header">
          Be active and get
          <span style={{ color: "var(--purple-to-text-color)" }}> reward!</span>
        </div>
        <div className="welcome2-page__content">
          <div className="welcome2-page__content__image">
            <img src={welcome2img} alt="" width="293px" />
          </div>
          <div className="welcome2-page__content__text">
            Comment and contribute to the community. Receive{" "}
            <b>10 BZZ tokens</b> for 10 valuable contributions.
          </div>
        </div>
        <div>
          <Link to="/welcome2">
            <WelcomeButton>Next</WelcomeButton>
          </Link>
          <div className="welcome2-page__bottom-text">
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
