import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import errorAlertIcon from "../../assets/input-validation-alert-icon.png";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import { ROUTES } from "../../constants/routes";

import "./ProfileCreation.scss";

import { useUserContext } from "@/contexts/user";
import { handleKeyDown } from "@/utils/common";
import { createMonogram, generateRandomUsername } from "@/utils/user";

const ProfileCreation: React.FC = () => {
  const { login } = useUserContext();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(() => generateRandomUsername());
  const [validationError, setValidationError] = useState<string>("");

  const validateUsername = (name: string): string => {
    if (name.trim().length === 0) {
      return "Please enter a nickname";
    }

    if (!/[a-zA-Z0-9]/.test(name)) {
      return "Nickname must include at least one letter or number";
    }

    if (!/^[a-zA-Z0-9 ]*$/.test(name)) {
      return "Nickname can only contain letters, numbers, and spaces";
    }

    if (/ {2}/.test(name)) {
      return "Nickname cannot have consecutive spaces";
    }

    const spaceCount = (name.match(/ /g) || []).length;
    if (spaceCount > 2) {
      return "Nickname cannot have more than 2 spaces";
    }

    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    if (validationError) {
      setValidationError("");
    }
  };

  const handleSubmit = async () => {
    const trimmedUsername = username.trim();

    const error = validateUsername(username);
    if (error) {
      setValidationError(error);
      return;
    }

    try {
      await login(trimmedUsername);
      navigate(ROUTES.HOME);
    } catch (err) {
      console.error(`Error logging in with username "${trimmedUsername}":`, err);
      setValidationError("Something went wrong. Please try again.");
    }
  };

  const isButtonActive = username.trim().length > 0 && !validationError;

  return (
    <div className="welcome-page grid">
      <div className="profile-creation__top">
        <div className="welcome-page__header">
          Create <br />
          <span style={{ color: "var(--bbw-blue)" }}>Your profile</span>
        </div>
        <div className="profile-creation__main-content">
          <ProfilePicture name={username ? createMonogram(username) : ""} />
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
                  placeholder="Enter your nickname"
                  maxLength={24}
                  className="profile-creation__user-input__input"
                  onKeyDown={(e) => handleKeyDown(e, "Enter", handleSubmit)}
                  onChange={handleInputChange}
                  autoFocus
                />
              </div>
            </div>
            {validationError && (
              <div className="profile-creation__user-input__error-container">
                <div className="profile-creation__user-input__error-container__error">
                  <img src={errorAlertIcon} alt="" className="profile-creation__user-input__error-container__error-icon" />
                  <div className="profile-creation__user-input__error-container__error-text">{validationError}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="profile-creation__bottom">
        <WelcomeButton version={isButtonActive ? "filled" : "inactive"} onClick={handleSubmit}>
          Enter private chat
        </WelcomeButton>
      </div>
    </div>
  );
};

export default ProfileCreation;
