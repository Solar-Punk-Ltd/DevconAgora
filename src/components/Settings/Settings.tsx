import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ROUTES } from "../../constants/routes";
import SettingsIcon from "../icons/SettingsIcon/SettingsIcon";

import "./Settings.scss";
import { useUserContext } from "@/contexts/user";
const Settings: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { logout, isSwarmEnabled, isUserLoggedIn } = useUserContext();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
  };

  useEffect(() => {
    if (isSwarmEnabled && !isUserLoggedIn) {
      navigate(ROUTES.HOME);
    }
  }, [isSwarmEnabled, isUserLoggedIn]);

  return (
    <>
      {isOpen ? <div className="settings__open__background"></div> : null}
      <div className="settings" onClick={() => setIsOpen(!isOpen)}>
        <SettingsIcon open={isOpen} />
      </div>
      {isOpen ? (
        <div className="settings__open__content">
          <Link to={ROUTES.TERMSANDCONDITIONS}>
            <div className="settings__open__content__item">Terms and Conditions</div>
          </Link>
          <div className="settings__open__content__item" onClick={handleLogoutClick}>Logout</div>
        </div>
      ) : null}
    </>
  );
};

export default Settings;
