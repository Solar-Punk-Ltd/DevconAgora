import React, { useRef } from "react";
import { Link } from "react-router-dom";
import createYourProfileEffect from "../../assets/create-your-profile-effect.png";
import errorAlertIcon from "../../assets/input-validation-alert-icon.png";
import "./ProfileCreation.scss";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";
import EditIcon from "../../components/icons/EditIcon/EditIcon";
import clsx from "clsx";
import OkIcon from "../../components/icons/OkIcon/OkIcon";
import { useGlobalState } from "../../GlobalStateContext";
import { ROUTES } from "../../utils/constants";
import { createMonogram } from "../../utils/helpers";
import { ethers } from "ethers";

const ProfileCreation: React.FC = () => {
  const { username, setUsername, monogram, setMonogram } = useGlobalState();
  const [buttonActive, setButtonActive] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleEditClick = () => {
    setIsEdit(true);
    setButtonActive(false);
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleOkClick();
    }
  };

  const savePrivKey = () => {
    const newKey = ethers.Wallet.createRandom().privateKey;
    localStorage.setItem("privKey", newKey);
  }

  const handleOkClick = () => {
    if (validateInput(username)) {
      setButtonActive(true);
      setIsEdit(false);
      setMonogram(createMonogram(username));
    } else {
      setButtonActive(false);
      setError(true);
    }
  };

  const validateInput = (name: string) => {
    if (name.length > 0) {
      return true;
    } else {
      return false;
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
          <div className="profile-creation__main-content">
            <ProfilePicture
              name={monogram ? monogram : createMonogram(username)}
            />
            <div>
              <div className="profile-creation__username">Nickname</div>
              <div className="profile-creation__username-edit">
                <div className="profile-creation__user-input">
                  <input
                    type="text"
                    value={username}
                    ref={inputRef}
                    placeholder="Generated Nickname"
                    className={clsx("profile-creation__user-input__input", {
                      "profile-creation__user-input__input__disabled": !isEdit,
                    })}
                    onKeyDown={handleKeyDown}
                    onChange={onInputChange}
                    readOnly={!isEdit}
                  />
                </div>

                {!isEdit ? (
                  <EditIcon onClick={handleEditClick} />
                ) : (
                  <OkIcon onClick={handleOkClick} />
                )}
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
          <Link to={ROUTES.HOME}>
            <WelcomeButton
              version={buttonActive ? "filled" : "inactive"}
              onClick={() => {
                handleOkClick();
                savePrivKey();
              }}
            >
              Start Building Your Community
            </WelcomeButton>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ProfileCreation;
