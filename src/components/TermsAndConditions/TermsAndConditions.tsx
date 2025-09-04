import React from "react";

import {
  ACCEPTANCE_OF_TERMS_HEADER,
  ACCEPTANCE_OF_TERMS_TEXT,
  DATA_STORAGE_HEADER,
  DATA_STORAGE_LOCATION,
  DATA_STORAGE_TEXT,
  DISCLAIMER_OF_LIABILITY_HEADER,
  DISCLAIMER_OF_LIABILITY_TEXT,
  PERSONAL_DATA_HEADER,
  PERSONAL_DATA_TEXT,
} from "../../utils/constants";
import CheckBoxIcon from "../icons/CheckBoxIcon/CheckBoxIcon";

import "./TermsAndConditions.scss";

interface TermsAndConditionsProps {
  contentFilterCheckBox?: boolean;
  termsAndConditionCheckBox?: boolean;
  termsAndConditionCheckBoxHandler?: () => void;
  termsAndConditionCheckBoxValue?: boolean;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  termsAndConditionCheckBox,
  termsAndConditionCheckBoxHandler,
  termsAndConditionCheckBoxValue,
}) => {
  return (
    <div className="terms-and-conditions">
      <div className="terms-and-conditions__text__header">{DISCLAIMER_OF_LIABILITY_HEADER}</div>
      <div className="terms-and-conditions__text">{DISCLAIMER_OF_LIABILITY_TEXT}</div>
      <div className="terms-and-conditions__text__header">{PERSONAL_DATA_HEADER}</div>
      <div className="terms-and-conditions__text">{PERSONAL_DATA_TEXT}</div>
      <div className="terms-and-conditions__text__header">{DATA_STORAGE_HEADER}</div>
      <div className="terms-and-conditions__text">
        {DATA_STORAGE_TEXT}
        <a id="data-storage-link" target="_blank" rel="noopener noreferrer" href={DATA_STORAGE_LOCATION}>
          {DATA_STORAGE_LOCATION}
        </a>
      </div>
      <div className="terms-and-conditions__text__header">{ACCEPTANCE_OF_TERMS_HEADER}</div>
      <div className="terms-and-conditions__text">{ACCEPTANCE_OF_TERMS_TEXT}</div>

      {termsAndConditionCheckBox ? (
        <div className="terms-and-conditions__checkbox-setting">
          <CheckBoxIcon
            checked={termsAndConditionCheckBoxValue ? termsAndConditionCheckBoxValue : false}
            onClick={termsAndConditionCheckBoxHandler}
          />{" "}
          Agree with Terms and Conditions
        </div>
      ) : null}
    </div>
  );
};

export default TermsAndConditions;
