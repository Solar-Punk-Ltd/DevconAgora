import React from "react";
import { Link } from "react-router-dom";
import createYourProfileEffect from "../../assets/create-your-profile-effect.png";
import errorAlertIcon from "../../assets/input-validation-alert-icon.png";
import "./ProfileCreation.scss";
import OpenProfilePicture from "../../components/OpenProfilePicture/OpenProfilePicture";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";

const OpenProfile: React.FC = () => {
  const [username, setUsername] = React.useState("");
  const [buttonActive, setButtonActive] = React.useState(false);
  const [error, setError] = React.useState(false);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (e.target.value.length > 0) {
      setButtonActive(true);
    } else {
      setButtonActive(false);
      setError(true);
    }
  };
  return (
    <>
      <div className="welcome-page">
        <div className="profile-creation__top">
          <div className="welcome-page__header">
            Create <br />
            <span style={{ color: "var(--purple-to-text-color)" }}>
              Your profile
            </span>
          </div>
          <div className="profile-creation__background-effect">
            <img
              src={createYourProfileEffect}
              alt=""
              className="profile-creation__backgorund-effect__img"
            />
          </div>
          <div style={{}} className="profile-creation__main-content">
            <OpenProfilePicture name="CM" />
            <div>
              <div className="profile-creation__username">Nickname</div>
              <div className="profile-creation__username-edit">
                <div className="profile-creation__user-input">
                  <input
                    type="text"
                    value={username}
                    placeholder="Chain Master"
                    className="profile-creation__user-input__input"
                    onChange={onInputChange}
                  />
                </div>
              </div>
              {error ? (
                <div className="profile-creation__user-input__error">
                  <img
                    src={errorAlertIcon}
                    alt=""
                    className="profile-creation__user-input__error-icon"
                    width="12px"
                    height="12px"
                  />
                  <div className="profile-creation__user-input__error-text">
                    &nbsp; This nickname is already taken.
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="profile-creation__bottom">
          <Link to="/mainprofile">
            <WelcomeButton version={buttonActive ? "filled" : "inactive"}>
              Start Building Your Community
            </WelcomeButton>
          </Link>
        </div>
      </div>
    </>
  );
};

export default OpenProfile;
