import React from "react";
import "./HowDoesItWork.scss";
import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";
import HomeBackground from "../../assets/welcome-glass-effect.png";
import CollectPointsImg from "../../assets/collect-points.png";
import ProfileGetBZZImg from "../../assets/profile-get-BZZ.png";

const HowDoesItWork: React.FC = () => {
  return (
    <div className="how-does-it-work-page">
      <NavigationHeader to="/profile" />
      <div className="how-does-it-work-page__content">
        <div className="how-does-it-work-page__content__background">
          <img
            src={HomeBackground}
            alt=""
            className="how-does-it-work-page__box__img"
          />
        </div>
        <div className="how-does-it-work-page__box">
          <div className="how-does-it-work-page__box__header">
            Collect points
          </div>
          <div className="how-does-it-work-page__box__content">
            Share your thoughts and <b>chat </b>
            and <b>invite</b> others and <b>save</b> events.
          </div>
          <div>
            <img
              src={CollectPointsImg}
              alt=""
              className="how-does-it-work-page__box__img"
            />
          </div>
        </div>
        <div className="how-does-it-work-page__box">
          <div className="how-does-it-work-page__box__header">
            Get 10 points and convert them to
            <span className="how-does-it-work-page__box__header__BZZ-emphasize">
              {" "}
              BZZ Tokens
            </span>
          </div>
          <div className="how-does-it-work-page__box__content">
            When you collect 10 points, you can redeem them for BZZ Tokens
          </div>
          <div>
            <img
              src={ProfileGetBZZImg}
              alt=""
              className="how-does-it-work-page__box__img"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowDoesItWork;
