import clsx from "clsx";
import { ethers } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import createYourProfileEffect from "../../assets/create-your-profile-effect.png";
import errorAlertIcon from "../../assets/input-validation-alert-icon.png";
import EditIcon from "../../components/icons/EditIcon/EditIcon";
import EnterIcon from "../../components/icons/EnterIcon/EnterIcon";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import { useGlobalState } from "../../contexts/global";
import { ROUTES } from "../../utils/constants";
import { createMonogram, getLocalPrivateKey, handleKeyDown } from "../../utils/helpers";

import "./ProfileCreation.scss";

const ProfileCreation: React.FC = () => {
  const { username, setUsername, monogram, setMonogram } = useGlobalState();
  const [buttonActive, setButtonActive] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [userNameSetError, setUserNameSetError] = useState<boolean>(false);
  const [otherError, setOtherError] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    if (!validateInput(e.target.value)) {
      setError(true);
      setOtherError(false);
      setUserNameSetError(false);
    } else {
      setUsername(e.target.value);
      setError(false);
    }
  };

  const handleEditClick = () => {
    setIsEdit(true);
    setButtonActive(false);
  };

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
      setTimeout(() => {
        inputRef.current?.select();
      }, 0);
    } else if (!isEdit && inputRef.current) {
      inputRef.current.setSelectionRange(0, 0);
      (document.activeElement as HTMLElement)?.blur(); // Remove focus from the input
    }
  }, [isEdit]);

  const savePrivKey = () => {
    const newKey = ethers.Wallet.createRandom().privateKey;
    localStorage.setItem("privKey", newKey);
  };

  const saveUsername = async () => {
    try {
      await fetch(process.env.BACKEND_API_URL + "/username", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, key: getLocalPrivateKey() }),
      });
    } catch (error) {
      setUserNameSetError(true);
      console.error("error saving username: ", error);
    }
  };

  const handleOkClick = async () => {
    if (validateInput(username) && username.length > 0 && username.trim() !== "") {
      setError(false);
      setIsEdit(false);
      setMonogram(createMonogram(username));
      try {
        const response = await fetch(process.env.BACKEND_API_URL + "/username/" + username);
        if (response.status === 200) {
          setButtonActive(true);
          setError(false);
        } else if (response.status === 409) {
          setButtonActive(false);
          setError(true);
          setUserNameSetError(true);
        } else {
          setButtonActive(false);
          setError(true);
          setOtherError(true);
        }
      } catch (err) {
        setButtonActive(false);
        setError(true);
        setOtherError(true);
        console.error(`error fetching username "${username}" :`, err);
      }
    } else {
      setButtonActive(false);
      setError(true);
    }
  };

  const validateInput = (name: string) => {
    const regex = /^(?!.* {2})(?!(?:.* ){3})(?=.*[a-zA-Z0-9])?[a-zA-Z0-9 ]*$/;
    return regex.test(name);
  };

  return (
    <>
      <div className="welcome-page">
        <div className="profile-creation__top">
          <div className="welcome-page__header">
            Create <br />
            <span style={{ color: "var(--default-purple)" }}>Your profile</span>
          </div>
          <div className="profile-creation__background-effect">
            <img src={createYourProfileEffect} alt="" className="profile-creation__backgorund-effect__img" />
          </div>
          <div className="profile-creation__main-content">
            <ProfilePicture name={monogram ? monogram : createMonogram(username)} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="profile-creation__username">Nickname</div>
              <div className="profile-creation__username-edit">
                <div className="profile-creation__user-input">
                  <input
                    type="text"
                    value={username}
                    ref={inputRef}
                    placeholder={username}
                    maxLength={24}
                    className={clsx("profile-creation__user-input__input", {
                      "profile-creation__user-input__input__disabled": !isEdit,
                    })}
                    onKeyDown={(e) => handleKeyDown(e, "Enter", handleOkClick)}
                    onChange={onInputChange}
                    readOnly={!isEdit}
                  />
                </div>

                {!isEdit ? <EditIcon onClick={handleEditClick} /> : <EnterIcon onClick={handleOkClick} />}
              </div>
              {error ? (
                <div className="profile-creation__user-input__error-container">
                  <div className="profile-creation__user-input__error-container__error">
                    <img src={errorAlertIcon} alt="" className="profile-creation__user-input__error-container__error-icon" />
                    {userNameSetError ? (
                      <div className="profile-creation__user-input__error-container__error-text">
                        The username is already taken. Please try another one.
                      </div>
                    ) : otherError ? (
                      <div className="profile-creation__user-input__error-container__error-text">
                        Something happened during username validation. Please try again.
                      </div>
                    ) : (
                      <div className="profile-creation__user-input__error-container__error-text">
                        The name can only contain alphanumeric characters, must include alphanumeric characters, and cannot have more than 2 spaces.
                      </div>
                    )}
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
                saveUsername();
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
