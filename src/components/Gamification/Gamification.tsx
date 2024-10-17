import React from "react";
import "./Gamification.scss";

import GamificationBackgroundOne from "../../assets/gamification-first-point.png";
import GamificationBackgroundFive from "../../assets/gamification-five-points.png";
import GamificationBackgroundTen from "../../assets/gamification-ten-points.png";
import CloseIcon from "../icons/CloseIcon/CloseIcon";
import { useGlobalState } from "../../GlobalStateContext";
import { ROUTES } from "../../utils/constants";
import { Link } from "react-router-dom";
import clsx from "clsx";
import ClaimRewardExplanation from "../ClaimRewardExplanation/ClaimRewardExplanation";

interface GamificationProps {
  points: number;
}

const Gamification: React.FC<GamificationProps> = ({ points }) => {
  const { setShowGamification } = useGlobalState();
  const [showClaimReward, setShowClaimReward] = React.useState(false);
  return (
    <>
      <div className="gamification">
        {showClaimReward ? (
          <ClaimRewardExplanation />
        ) : (
          <div className="gamification__modal">
            <img
              src={
                points === 1
                  ? GamificationBackgroundOne
                  : points === 5
                  ? GamificationBackgroundFive
                  : GamificationBackgroundTen
              }
              alt=""
              className={clsx("gamification__modal__img", {
                "gamification__modal_img__ten-points": points === 10,
              })}
            />
            <div className="gamification__modal__content">
              <div className="gamification__modal__content__close">
                <CloseIcon
                  color="white"
                  onClick={() => setShowGamification(false)}
                />
              </div>

              <div className="gamification__modal__content_main">
                <div className="gamification__modal__content__header">
                  {points === 1 ? (
                    <>
                      You&nbsp;have&nbsp;just&nbsp;made&nbsp;your&nbsp;first&nbsp;comment
                      and your first step towards your&nbsp;
                      <span className="gamification__modal__content__header__emphasize">
                        magic&nbsp;code.
                      </span>
                      &nbsp;Still 9 to go.
                    </>
                  ) : points === 5 ? (
                    <>
                      Five comments made brought you to the half of your road.
                      There is{" "}
                      <span className="gamification__modal__content__header__emphasize">
                        only&nbsp;5&nbsp;more
                      </span>{" "}
                      to&nbsp;get&nbsp;your&nbsp;
                      <span className="gamification__modal__content__header__emphasize">
                        magic&nbsp;code.
                      </span>
                    </>
                  ) : (
                    <>
                      You&nbsp;have&nbsp;
                      <span className="gamification__modal__content__header__emphasize">
                        unlocked your magic code!
                      </span>{" "}
                      You can start your own node and participate yourself in
                      the Swarm network.
                    </>
                  )}
                </div>
                {points === 10 ? (
                  <button
                    className="gamification__modal__content__claim-button"
                    onClick={() => {
                      setShowClaimReward(true);
                    }}
                  >
                    Claim your reward
                  </button>
                ) : null}
                <Link to={ROUTES.HOWDOESITWORK}>
                  <div className="gamification__modal__content_how">
                    How does it work?
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Gamification;
