import React, { useRef } from "react";
import "./ClaimRewardPage.scss";
import HomeBackground from "../../assets/registration-glass-effect.png";
import CopyIcon from "../../components/icons/CopyIcon/CopyIcon";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const ClaimRewardPage: React.FC = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopyClick = async () => {
    if (inputRef.current) {
      inputRef.current.select();
      await navigator.clipboard.writeText(inputRef.current.value);
    }
  };
  return (
    <div className="claim-reward">
      <div className="claim-reward__background">
        <img
          src={HomeBackground}
          alt=""
          className="claim-reward__background__img"
        />
      </div>
      <div className="claim-reward__main-content">
        <div className="claim-reward__main-content__header">
          Claim{" "}
          <span className="claim-reward__text-emphasize">your&nbsp;reward</span>
        </div>
        <div className="claim-reward__main-content__content">
          <div className="claim-reward__text-box">
            This code is personalised for you only. Please save this code and
            use it as described on the previous screen.
          </div>
          <div className="claim-reward__code">
            <div className="claim-reward__code__header">Giftcode</div>
            <div className="claim-reward__code__input-wrapper">
              <input
                type="text"
                ref={inputRef}
                className="claim-reward__code__input"
              />
              <CopyIcon onClick={handleCopyClick} />
            </div>
          </div>
          <div className="claim-reward__text-box">
            You will find this information in your profile from now on.
          </div>
        </div>
      </div>
      <div className="claim-reward__bottom-buttons">
        <WelcomeButton type="white" onClick={() => navigate(ROUTES.HOME)}>
          Back
        </WelcomeButton>
        <WelcomeButton
          type="orange"
          onClick={() => navigate(ROUTES.STAYUPDATED)}
        >
          Registration
        </WelcomeButton>
      </div>
    </div>
  );
};

export default ClaimRewardPage;
