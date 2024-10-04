import React from "react";
import "./ProfileBox.scss";
import { Link } from "react-router-dom";
import ReferalQRIcon from "../../assets/referal-qr.svg";
import clsx from "clsx";

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
      <div
        className={clsx({
          "profile-box__left-content": points < 10,
          "profile-box__left-content__with-link": points === 10,
        })}
      >
        <div className="profile-box__title">{title}</div>

        {link && points === 10 ? (
          <div>
            <Link to="points">
              <div className="profile-box__link">{link}</div>
            </Link>
          </div>
        ) : null}
      </div>
      {showPoints ? (
        <div className="profile-box__right-content">
          <div
            className={clsx({
              "profile-box__points-box": points < 10,
              "profile-box__points-box__ten": points === 10,
            })}
          >
            {points}
          </div>
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
