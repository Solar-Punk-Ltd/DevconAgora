import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import HomeBackground from "../../assets/welcome-glass-effect.png";
import TermsAndConditions from "../../components/TermsAndConditions/TermsAndConditions";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import { useGlobalState } from "../../contexts/global";
import { ROUTES } from "../../utils/constants";

import "./TACOnboardingPage.scss";

const TACOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setIsTermsAndConditionsAccepted } = useGlobalState();
  const [isTermsAndConditionsChecked, setIsTermsAndConditionsChecked] =
    useState<boolean>(false);
  const handleOkClick = () => {
    if (isTermsAndConditionsChecked) {
      setIsTermsAndConditionsAccepted(true);
      navigate(ROUTES.PROFILECREATION);
    }
  };

  return (
    <>
      <div className="terms-and-conditions-onboarding-page">
        <div className="terms-and-conditions-onboarding-page__background">
          <img
            src={HomeBackground}
            alt=""
            className="terms-and-conditions-onboarding-page__background__image"
          />
        </div>
        <div className="terms-and-conditions-onboarding-page__header">
          Terms and Conditions
        </div>
        <TermsAndConditions
          contentFilterCheckBox={true}
          termsAndConditionCheckBox={true}
          termsAndConditionCheckBoxHandler={() =>
            setIsTermsAndConditionsChecked(!isTermsAndConditionsChecked)
          }
          termsAndConditionCheckBoxValue={isTermsAndConditionsChecked}
        />
        <div className="terms-and-conditions-onboarding-page__bottom">
          <div className="terms-and-conditions-onboarding-page__bottom__back-button">
            <Link to={ROUTES.WELCOME4}>
              <WelcomeButton version="outlined">Back</WelcomeButton>
            </Link>
          </div>
          <div className="terms-and-conditions-onboarding-page__bottom__back-button">
            <WelcomeButton
              version={isTermsAndConditionsChecked ? "filled" : "inactive"}
              onClick={handleOkClick}
            >
              Let’s go
            </WelcomeButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default TACOnboardingPage;
