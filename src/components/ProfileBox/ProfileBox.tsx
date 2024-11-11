import React from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import ReferalQRIcon from '../../assets/referal-qr.svg';

import './ProfileBox.scss';

interface ProfileBoxProps {
  title?: string;
  content?: string;
  linkText?: string;
  link?: string;
  showPoints?: boolean;
  showContent?: boolean;
  points?: number;
  to?: string;
  shareable?: boolean;
}

const ProfileBox: React.FC<ProfileBoxProps> = ({
  title,
  linkText,
  link,
  points = 10,
  showPoints,
  showContent,
  shareable,
}) => {
  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Check out this profile!',
          text: 'Here is some interesting content.',
          url: window.location.origin,
        })
        .then(() => {
          console.log('Content shared successfully');
        })
        .catch((error) => {
          console.error('Error sharing content:', error);
        });
    } else {
      console.log('Web Share API not supported in this browser');
    }
  };
  return (
    <div className="profile-box">
      <div
        className={clsx({
          'profile-box__left-content': points < 10,
          'profile-box__left-content__with-link': points >= 10,
        })}
      >
        <div className="profile-box__title">{title}</div>

        {linkText && link && points >= 10 && !shareable ? (
          <div>
            <div className="profile-box__link" onClick={() => handleNavigation(link)}>
              {linkText}
            </div>
          </div>
        ) : linkText && shareable ? (
          <div className="profile-box__link" onClick={handleShare}>
            {linkText}
          </div>
        ) : null}
      </div>
      {showPoints ? (
        <div className="profile-box__right-content">
          <div
            className={clsx({
              'profile-box__points-box': points < 10,
              'profile-box__points-box__ten': points >= 10,
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
