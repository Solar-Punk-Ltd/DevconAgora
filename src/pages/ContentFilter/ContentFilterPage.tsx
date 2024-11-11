import React from "react";
import { Link } from "react-router-dom";

import HomeBackground from "../../assets/welcome-glass-effect.png";
import ContentFilter from "../../components/ContentFilter/ContentFilter";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import { ROUTES } from "../../utils/constants";

import "./ContentFilter.scss";

const ContentFilterPage: React.FC = () => {
  return (
    <>
      <div className="content-filter-page">
        <div className="content-filter-page__background">
          <img
            src={HomeBackground}
            alt=""
            className="content-filter-page__background__image"
          />
        </div>
        <div className="content-filter-page__top">
          <div className="content-filter-page__header">
            User Side Content Visibility&nbsp;Sanitizer
          </div>
          <ContentFilter />
        </div>
        <Link to={ROUTES.PROFILE}>
          <div className="content-filter-page__bottom">
            <WelcomeButton version="filled">Back</WelcomeButton>
          </div>
        </Link>
      </div>
    </>
  );
};

export default ContentFilterPage;
