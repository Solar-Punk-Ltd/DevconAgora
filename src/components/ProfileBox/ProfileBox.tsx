import React from "react";
import "./ProfileBox.scss";
import { Link } from "react-router-dom";
import PointsInfo from "./PointsInfo/PointsInfo";
import ReferalQRIcon from "../../assets/referal-qr.svg";

interface ProfileBoxProps {
  title?: string;
  content?: string;
  link?: string;
  showPoints?: boolean;
  showContent?: boolean;
  points?: number;
  to?: string;
}

const ProfileBox: React.FC<ProfileBoxProps> = ({
  title,
  link,
  points = 10,
  showPoints,
  showContent,
}) => {
  return (
    <div className="profile-box">
      <div className="profile-box__left-content">
        <div className="profile-box__title">{title}</div>
        {showPoints ? (
          <div className="profile-box__content">
            <PointsInfo points={points} />
          </div>
        ) : showContent ? (
          <div className="profile-box__content">
            <div>
              For each active registration, you get an extra{" "}
              <span className="profile-box__content__points-emphasize">
                2 points
              </span>
              .
            </div>
          </div>
        ) : null}
        {link ? (
          <div>
            <Link to="points">
              <div className="profile-box__link">{link}</div>
            </Link>
          </div>
        ) : null}
      </div>
      {showPoints ? (
        <div className="profile-box__right-content">
          <div className="profile-box__points-box">{points}</div>
        </div>
      ) : showContent ? (
        <div className="profile-box__right-content">
          <div>
            <img src={ReferalQRIcon} alt="" />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileBox;
