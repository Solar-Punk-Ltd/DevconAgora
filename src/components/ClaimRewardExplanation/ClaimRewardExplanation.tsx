import React from "react";
import { useNavigate } from "react-router-dom";

import GamificationBackgroundTen from "../../assets/gamification-ten-points.png";
import { useGlobalState } from "../../contexts/global";
import { ROUTES } from "../../utils/constants";
import CloseIcon from "../icons/CloseIcon/CloseIcon";

import "./ClaimRewardExplanation.scss";

const ClaimRewardExplanation: React.FC = () => {
  const { setShowGamification } = useGlobalState();
  const navigate = useNavigate();
  return (
    <div className="claim-reward-explanation">
      <div className="claim-reward-explanation__header-content">
        <div className="claim-reward__close">
          <CloseIcon color="white" onClick={() => setShowGamification(false)} />
        </div>
        <div className="claim-reward-explanation__header">
          On&nbsp;the&nbsp;next&nbsp;screen&nbsp;you <br /> will get your magic
          code
        </div>
      </div>
      <div>
        <img
          src={GamificationBackgroundTen}
          alt=""
          className="claim-reward-explanation__img"
        />
      </div>
      <div className="claim-reward-explanation__content-wrapper">
        <div className="claim-reward-explanation__content">
          <b>
            Make use of it and experience how to upload and download from Swarm,
            the infrastructure behind devcon.buzz.
          </b>
          <br />
          1. Download and install Swarm Desktop from{" "}
          <span className="text-decoration-underline">
            https://desktop.ethswarm.org/
          </span>
          .
          <br />
          2. Open Swarm Desktop and ensure your node is connected (look for the
          “Node OK” status at the bottom left).
          <br />
          3. On the left side of the dashboard, find and click on “Redeem gift
          code” from the menu.
          <br />
          4. In the “Top-up with gift code” section, paste your gift code into
          the input field.
          <br />
          5. Click “Proceed” to complete the top-up. Stay on the top of cutting
          edge web3 tech. Get insights and laterst news from the developers of
          the Devcon Buzz app
        </div>
        <div className="claim-reward-explanation__claim-button-wrapper">
          <button
            className="claim-reward-explanation__claim-button"
            onClick={() => {
              setShowGamification(false);
              navigate(ROUTES.CLAIMREWARD);
            }}
          >
            Show my code!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimRewardExplanation;
