import React from "react";
import "./StayUpdatedPage.scss";
import HomeBackground from "../../assets/registration-glass-effect.png";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const StayUpdatedPage: React.FC = () => {
  const navigate = useNavigate();
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
          <input type="text" className="stay-updated__input" />
        </div>
        <div className="stay-updated__input-wrapper">
          <div className="stay-updated__input__header">
            First name{" "}
            <span className="stay-updated__input__header__requred">*</span>
          </div>
          <input type="text" className="stay-updated__input" />
        </div>
        <div className="stay-updated__input-wrapper">
          <div className="stay-updated__input__header">
            Last name{" "}
            <span className="stay-updated__input__header__requred">*</span>
          </div>
          <input type="text" className="stay-updated__input" />
        </div>
        <div className="stay-updated__input-wrapper">
          <div className="stay-updated__input__header">Company name</div>
          <input type="text" className="stay-updated__input" />
        </div>
        <div className="stay-updated__input-wrapper">
          <div className="stay-updated__input__header">
            In which phase is your company in?
          </div>
          <input type="text" className="stay-updated__input" />
        </div>
        <div className="stay-updated__input-wrapper">
          <div className="stay-updated__input__header">Website</div>
          <input type="text" className="stay-updated__input" />
        </div>
        <div className="stay-updated__bottom-buttons">
          <WelcomeButton type="white" onClick={() => navigate(ROUTES.HOME)}>
            Cancel
          </WelcomeButton>
          <WelcomeButton type="orange" onClick={() => navigate(ROUTES.HOME)}>
            Done
          </WelcomeButton>
        </div>
      </div>
    </div>
  );
};

export default StayUpdatedPage;
