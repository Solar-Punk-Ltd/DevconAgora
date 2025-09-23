import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import bbwIntro from "../../assets/bbw-intro.png";
import bySolarPunk from "../../assets/by-solar-punk.png";
import { TEXTS } from "../../constants/text";
import { ROUTES } from "../../utils/constants";
import { isUserRegistered } from "../../utils/helpers";

import "./Intro.scss";

function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isUserRegistered()) {
        navigate(ROUTES.HOME);
      } else {
        navigate(ROUTES.WELCOME1);
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);
  return (
    <>
      <div className="opening-page grid">
        <div style={{}} className="opening-page__text-layer">
          <div className="opening-page__header">
            <div>{TEXTS.APP_NAME}</div>

            <img src={bySolarPunk} alt="" height="30px" width="104px" />
          </div>
          <img src={bbwIntro} className="opening-page__intro" />
        </div>
      </div>
    </>
  );
}

export default Intro;
