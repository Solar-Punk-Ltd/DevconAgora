import React from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../utils/constants";
import SettingsIcon from "../icons/SettingsIcon/SettingsIcon";

import "./Settings.scss";
const Settings: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  return (
    <>
      {isOpen ? <div className="settings__open__background"></div> : null}
      <div className="settings" onClick={() => setIsOpen(!isOpen)}>
        <SettingsIcon open={isOpen} />
      </div>
      {isOpen ? (
        <div className="settings__open__content">
          <Link to={ROUTES.CONTENTFILTER}>
            <div className="settings__open__content__item">USCVS setting</div>
          </Link>
          <hr className="settings__open__content__item__divider" />
          <Link to={ROUTES.TERMSANDCONDITIONS}>
            <div className="settings__open__content__item">
              Terms and Conditions
            </div>
          </Link>
        </div>
      ) : null}
    </>
  );
};

export default Settings;
