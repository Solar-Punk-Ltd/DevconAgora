import React from 'react';

import './HomeLoading.scss';

const HomeLoading: React.FC = () => {
  return (
    <div style={{ padding: '15px' }} className="home-loading">
      <div className="home-loading__main-box"></div>
      <div className="home-loading__recent-box">
        <div className="home-loading__recent-box__header">
          <div className="home-loading__recent-box__title"></div>
          <div className="home-loading__recent-box__all"></div>
        </div>
        <div className="home-loading__recent-box__session-items-container">
          <div className="home-loading__recent-box__session-item-container__item__session"></div>
          <div className="home-loading__recent-box__session-item-container__item__session"></div>
        </div>
      </div>
      <div className="home-loading__recent-box">
        <div className="home-loading__recent-box__header">
          <div className="home-loading__recent-box__title"></div>
          <div className="home-loading__recent-box__all"></div>
        </div>
        <div className="home-loading__recent-box__room-items-container">
          <div className="home-loading__recent-box__room-item-container__item__room"></div>
          <div className="home-loading__recent-box__room-item-container__item__room"></div>
          <div className="home-loading__recent-box__room-item-container__item__room"></div>
        </div>
      </div>
    </div>
  );
};

export default HomeLoading;
