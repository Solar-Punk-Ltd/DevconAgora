import React from "react";

import CollectPointsImg from "../../assets/collect-points.png";
import ProfileGetBZZImg from "../../assets/profile-get-BZZ.png";
import HomeBackground from "../../assets/welcome-glass-effect.png";
import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";

import "./HowDoesItWork.scss";
// import { ROUTES } from "../../utils/constants";

interface HowDoesItWorkProps {
  toText?: string;
}

const HowDoesItWork: React.FC<HowDoesItWorkProps> = ({ toText }) => {
  return (
    <div className="how-does-it-work-page">
      <NavigationHeader toText={toText} />
      <div className="how-does-it-work-page__content">
        <div className="how-does-it-work-page__content__background">
          <img src={HomeBackground} alt="" className="how-does-it-work-page__box__img" />
        </div>
        <div className="how-does-it-work-page__box">
          <div className="how-does-it-work-page__box__header">Comments</div>
          <div className="how-does-it-work-page__box__content">
            Every time you make a valuable comment in the devcon.buzz application you make one step towards getting your own personalised code.
          </div>
          <div>
            <img src={CollectPointsImg} alt="" className="how-does-it-work-page__box__img" />
          </div>
        </div>
        <div className="how-does-it-work-page__box">
          <div className="how-does-it-work-page__box__header">Magic codes</div>
          <div className="how-does-it-work-page__box__content">
            Once you reach 10 comments you get your own personal code, that helps you to be part of the Swarm network yourself the easiest possible
            way.
          </div>
          <div>
            <img src={ProfileGetBZZImg} alt="" className="how-does-it-work-page__box__img" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowDoesItWork;
