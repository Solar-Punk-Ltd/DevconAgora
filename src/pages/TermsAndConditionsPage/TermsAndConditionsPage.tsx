import React from "react";
import "./TermsAndConditionsPage.scss";
import TermsAndConditions from "../../components/TermsAndConditions/TermsAndConditions";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const TermsAndConditionsPage: React.FC = () => {
  return (
    <>
      <div className="terms-and-conditions-page">
        <div className="terms-and-conditions-page__background">
          <img
            src={process.env.ASSETS_URL + "/assets/welcome-glass-effect.png"}
            alt=""
            className="terms-and-conditions-page__background__image"
          />
        </div>
        <div className="terms-and-conditions-page__header">
          Terms and Conditions
        </div>
        <TermsAndConditions />
        <Link to={ROUTES.PROFILE}>
          <div className="terms-and-conditions-page__bottom">
            <WelcomeButton version="filled">Back</WelcomeButton>
          </div>
        </Link>
      </div>
    </>
  );
};

export default TermsAndConditionsPage;
