import React from "react";
import "./Gamification.scss";

import GamificationBackground from "../../assets/gamification-background.png";
import SwarmIcon from "../../assets/swarm-icon.png";
import CloseIcon from "../icons/CloseIcon/CloseIcon";
import { useGlobalState } from "../../GlobalStateContext";
import { ROUTES } from "../../utils/constants";
import { Link } from "react-router-dom";

interface GamificationProps {
  points: number;
}

const Gamification: React.FC<GamificationProps> = ({ points }) => {
  const { setShowGamification } = useGlobalState();
  return (
    <div className="gamification">
      <div className="gamification__modal">
        <img
          src={GamificationBackground}
          alt=""
          className="gamification__modal__img"
        />
        <div className="gamification__modal__content">
          <div
            className="gamification__modal__content__close"
            onClick={() => setShowGamification(false)}
          >
            <CloseIcon color="white" />
          </div>
          <div className="gamification__modal__content__header">
            You got{" "}
            {points === 1 && points < 10 ? (
              <>
                <span> the </span>
                <span className="gamification__modal__content__header__emphasize">
                  first point{" "}
                </span>
              </>
            ) : points < 10 ? (
              <span className="gamification__modal__content__header__emphasize">
                {points} points{" "}
              </span>
            ) : (
              <span>
                the
                <span className="gamification__modal__content__header__emphasize">
                  {" "}
                  last point{" "}
                </span>
              </span>
            )}
            for your
          </div>
          <div className="gamification__modal__content__tokens">
            <span className="gamification__modal__content__emphasize">10 </span>
            <img
              src={SwarmIcon}
              alt=""
              className="gamification__modal__content__tokens_img"
            />{" "}
            Tokens
          </div>
          {points === 10 ? (
            <Link to={ROUTES.CLAIMREWARD}>
              <button
                className="gamification__modal__content__claim-button"
                onClick={() => setShowGamification(false)}
              >
                Claim your reward
              </button>
            </Link>
          ) : null}
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
  );
};

export default Gamification;
