import React from "react";

import CollectPointsImg from "../../assets/collect-points.png";
import ProfileGetBZZImg from "../../assets/profile-get-BZZ.png";
// import HomeBackground from "../../assets/welcome-glass-effect.png";
import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";

import "./HowDoesItWork.scss";

interface HowDoesItWorkProps {
  toText?: string;
}

const HowDoesItWork: React.FC<HowDoesItWorkProps> = ({ toText }) => {
  return (
    <div className="how-does-it-work-page">
      <NavigationHeader toText={toText} />
      <div className="how-does-it-work-page__content">
        <div className="how-does-it-work-page__content__background grid">
          {/* <img src={HomeBackground} alt="" className="how-does-it-work-page__box__img" /> */}
        </div>
        <div className="how-does-it-work-page__box">
          <div className="how-does-it-work-page__box__header">Comments</div>
          <div className="how-does-it-work-page__box__content">
            Each comment you write brings you one step closer to your own Swarm node!
          </div>
          <div>
            <img src={CollectPointsImg} alt="" className="how-does-it-work-page__box__img" />
          </div>
        </div>
        <div className="how-does-it-work-page__box">
          <div className="how-does-it-work-page__box__header">BZZ reward</div>
          <div className="how-does-it-work-page__box__content">
            After submitting 10 comments, you’ll receive your BZZ reward. This reward enables you to instantly join and participate in the Swarm network in one step.
          </div>
          <div>
            <img src={ProfileGetBZZImg} alt="" className="how-does-it-work-page__box__img" />
          </div>
        </div>
        <div className="how-does-it-work-page__box">
          <div className="how-does-it-work-page__box__header">What is BZZ?</div>
          <div className="how-does-it-work-page__box__content">
            <a id='bzz-link' href="https://www.ethswarm.org/get-bzz" target="_blank" rel="noopener noreferrer">BZZ</a> is the native token of Swarm that grants users access to data relay and storage services while also serving as compensation for node operators who provide these services.
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowDoesItWork;
