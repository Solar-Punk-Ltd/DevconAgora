import React from "react";
import "./TermsAndConditions.scss";
import {
  DISCLAIMER_OF_LIABILITY_HEADER,
  DISCLAIMER_OF_LIABILITY,
  PERSONAL_DATA_HEADER,
  PERSONAL_DATA,
  DATA_STORAGE_HEADER,
  DATA_STORAGE,
} from "../../utils/constants";

const TermsAndConditions: React.FC = () => {
  return (
    <div className="terms-and-conditions">
      <div className="terms-and-conditions__text__header">
        {DISCLAIMER_OF_LIABILITY_HEADER}
      </div>
      <div className="terms-and-conditions__text">
        {DISCLAIMER_OF_LIABILITY}
      </div>
      <div className="terms-and-conditions__text__header">
        {PERSONAL_DATA_HEADER}
      </div>
      <div className="terms-and-conditions__text">{PERSONAL_DATA}</div>
      <div className="terms-and-conditions__text__header">
        {DATA_STORAGE_HEADER}
      </div>
      <div className="terms-and-conditions__text">{DATA_STORAGE}</div>
    </div>
  );
};

export default TermsAndConditions;
