import React from "react";
import "./StayUpdatedPage.scss";
import HomeBackground from "../../assets/registration-glass-effect.png";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const StayUpdatedPage: React.FC = () => {
  const [emailText, setEmailText] = React.useState<string>("");
  const [emailError, setEmailError] = React.useState<boolean>(false);
  const [firstNameText, setFirstNameText] = React.useState<string>("");
  const [firstNameError, setFirstNameError] = React.useState<boolean>(false);
  const [lastNameText, setLastNameText] = React.useState<string>("");
  const [lastNameError, setLastNameError] = React.useState<boolean>(false);
  const [companyNameText, setCompanyNameText] = React.useState<string>("");
  const [phaseText, setPhaseText] = React.useState<string>("");
  const [websiteText, setWebsiteText] = React.useState<string>("");
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validateName = (name: string) => {
    return name.trim() !== "";
  };

  const handleEmailBlur = () => {
    if (!validateEmail(emailText)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };
  const handleFirstNameBlur = () => {
    if (!validateName(firstNameText)) {
      setFirstNameError(true);
    } else {
      setFirstNameError(false);
    }
  };
  const handleLastNameBlur = () => {
    if (!validateName(lastNameText)) {
      setLastNameError(true);
    } else {
      setLastNameError(false);
    }
  };
  return (
    <div className="stay-updated">
      <div className="stay-updated__background">
        <img
          src={HomeBackground}
          alt=""
          className="stay-updated__background__img"
        />
      </div>

      <div className="stay-updated__header">Stay updated!</div>
      <div className="stay-updated__main-content">
        <div className="stay-updated__text-box">
          Be on the top of cutting edge web3 tech. Get insights and latest news
          from the developers of the Devcon Buzz app
        </div>
        <div className="stay-updated__input-wrapper">
          <div className="stay-updated__input__header">
            Email{" "}
            <span className="stay-updated__input__header__requred">*</span>
          </div>
          <input
            type="text"
            className="stay-updated__input"
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            onBlur={handleEmailBlur}
          />
          {emailError ? (
            <div className="stay-updated__input__error">
              Invalid email format
            </div>
          ) : (
            <div className="stay-updated__input__error__placeholder"></div>
          )}
        </div>
        <div className="stay-updated__input-wrapper">
          <div className="stay-updated__input__header">
            First name{" "}
            <span className="stay-updated__input__header__requred">*</span>
          </div>
          <input
            type="text"
            className="stay-updated__input"
            value={firstNameText}
            onChange={(e) => setFirstNameText(e.target.value)}
            onBlur={handleFirstNameBlur}
          />
          {firstNameError ? (
            <div className="stay-updated__input__error">
              First name is required
            </div>
          ) : (
            <div className="stay-updated__input__error__placeholder"></div>
          )}
        </div>
        <div className="stay-updated__input-wrapper">
          <div className="stay-updated__input__header">
            Last name{" "}
            <span className="stay-updated__input__header__requred">*</span>
          </div>
          <input
            type="text"
            className="stay-updated__input"
            value={lastNameText}
            onChange={(e) => setLastNameText(e.target.value)}
            onBlur={handleLastNameBlur}
          />
          {lastNameError ? (
            <div className="stay-updated__input__error">
              Last name is required
            </div>
          ) : (
            <div className="stay-updated__input__error__placeholder"></div>
          )}
        </div>
        <div className="stay-updated__not-required-fields">
          <div className="stay-updated__input-wrapper">
            <div className="stay-updated__input__header">Company name</div>
            <input
              type="text"
              className="stay-updated__input"
              value={companyNameText}
              onChange={(e) => setCompanyNameText(e.target.value)}
            />
          </div>
          <div className="stay-updated__input-wrapper">
            <div className="stay-updated__input__header">
              In which phase is your company in?
            </div>
            <input
              type="text"
              className="stay-updated__input"
              value={phaseText}
              onChange={(e) => setPhaseText(e.target.value)}
            />
          </div>
          <div className="stay-updated__input-wrapper stay-updated__input-wrapper__bottom">
            <div className="stay-updated__input__header">Website</div>
            <input
              type="text"
              className="stay-updated__input"
              value={websiteText}
              onChange={(e) => setWebsiteText(e.target.value)}
            />
          </div>
        </div>
        <div className="stay-updated__bottom-buttons">
          <WelcomeButton type="white" onClick={() => navigate(ROUTES.HOME)}>
            Cancel
          </WelcomeButton>
          <WelcomeButton
            type="orange"
            onClick={() => navigate(ROUTES.HOME)}
            version={
              !lastNameText ||
              !firstNameText ||
              !emailText ||
              emailError ||
              firstNameError ||
              lastNameError
                ? "inactive"
                : "filled"
            }
          >
            Done
          </WelcomeButton>
        </div>
      </div>
    </div>
  );
};

export default StayUpdatedPage;
