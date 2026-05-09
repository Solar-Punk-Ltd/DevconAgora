import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import TermsAndConditions from "../../components/TermsAndConditions/TermsAndConditions";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import { ROUTES } from "../../constants/routes";
import { useGlobalState } from "../../contexts/global";

import "./TACOnboarding.scss";
import { useUserContext } from "@/contexts/user";

const TACOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { login, isSwarmInitialized, isUserLoggedIn } = useUserContext();
  const { setIsTermsAndConditionsAccepted } = useGlobalState();
  const [isTermsAndConditionsChecked, setIsTermsAndConditionsChecked] = useState<boolean>(false);
  const handleOkClick = async () => {
    if (!isTermsAndConditionsChecked) {
      return;
    }

    setIsTermsAndConditionsAccepted(true);
    if (!isSwarmInitialized) {
      navigate(ROUTES.PROFILECREATION);
      return;
    }

    try {
      await login();
    } catch (err) {
    }
  };

  useEffect(() => {
    if (isSwarmInitialized && isTermsAndConditionsChecked && isUserLoggedIn) {
      navigate(ROUTES.HOME);
    }
  }, [isUserLoggedIn]);

  return (
    <>
      <div className="terms-and-conditions-onboarding-page">
        <div className="terms-and-conditions-onboarding-page__background grid"></div>
        <div className="terms-and-conditions-onboarding-page__header">Terms and Conditions</div>
        <TermsAndConditions
          termsAndConditionCheckBox={true}
          termsAndConditionCheckBoxHandler={() => setIsTermsAndConditionsChecked(!isTermsAndConditionsChecked)}
          termsAndConditionCheckBoxValue={isTermsAndConditionsChecked}
        />
        <div className="terms-and-conditions-onboarding-page__bottom">
          <div className="terms-and-conditions-onboarding-page__bottom__back-button">
            <Link to={ROUTES.WELCOME3}>
              <WelcomeButton version="outlined">Back</WelcomeButton>
            </Link>
          </div>
          <div className="terms-and-conditions-onboarding-page__bottom__back-button">
            <WelcomeButton version={isTermsAndConditionsChecked ? "filled" : "inactive"} onClick={handleOkClick}>
              Let’s go
            </WelcomeButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default TACOnboarding;
