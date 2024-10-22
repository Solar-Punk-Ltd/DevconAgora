import React, { useEffect } from "react";
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
  const imageContainerRef = React.useRef<HTMLDivElement>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateContainerHeight = () => {
      if (imageContainerRef.current && imageRef.current && contentRef.current) {
        imageContainerRef.current.style.minHeight = `${imageRef.current.offsetHeight}px`;
        imageContainerRef.current.style.height = `${contentRef.current.offsetHeight}px`;
      }
    };
    window.addEventListener("resize", updateContainerHeight);

    const imgElement = imageRef.current;
    if (imgElement) {
      imgElement.addEventListener("load", updateContainerHeight);

      if (imgElement.complete) {
        updateContainerHeight();
      }
    }

    return () => {
      if (imgElement) {
        imgElement.removeEventListener("load", updateContainerHeight);
        window.removeEventListener("resize", updateContainerHeight);
      }
    };
  }, [points]);

  return (
    <>
      <div className="gamification">
        {showClaimReward ? (
          <ClaimRewardExplanation />
        ) : (
          <div className="gamification__modal" ref={imageContainerRef}>
            <img
              src={
                points === 1
                  ? GamificationBackgroundOne
                  : points === 5
                  ? GamificationBackgroundFive
                  : GamificationBackgroundTen
              }
              alt=""
              ref={imageRef}
              className={clsx("gamification__modal__img", {
                "gamification__modal_img__ten-points": points === 10,
              })}
            />
            <div className="gamification__modal__content" ref={contentRef}>
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
              </div>
              <div>
                <Link
                  to={ROUTES.HOWDOESITWORK}
                  onClick={() => setShowGamification(false)}
                >
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
