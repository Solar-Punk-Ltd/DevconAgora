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
import CheckBoxIcon from "../icons/CheckBoxIcon/CheckBoxIcon";
import { useGlobalState } from "../../GlobalStateContext";

interface TermsAndConditionsProps {
  contentFilterCheckBox?: boolean;
  termsAndConditionCheckBox?: boolean;
  termsAndConditionCheckBoxHandler?: () => void;
  termsAndConditionCheckBoxValue?: boolean;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  contentFilterCheckBox,
  termsAndConditionCheckBox,
  termsAndConditionCheckBoxHandler,
  termsAndConditionCheckBoxValue,
}) => {
  const { isContentFilterEnabled, setIsContentFilterEnabled } =
    useGlobalState();
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

      {contentFilterCheckBox ? (
        <div className="terms-and-conditions__checkbox-setting">
          <CheckBoxIcon
            checked={isContentFilterEnabled}
            onClick={() => setIsContentFilterEnabled(!isContentFilterEnabled)}
          />{" "}
          Content Filter enabled
        </div>
      ) : null}

      {termsAndConditionCheckBox ? (
        <div className="terms-and-conditions__checkbox-setting">
          <CheckBoxIcon
            checked={
              termsAndConditionCheckBoxValue
                ? termsAndConditionCheckBoxValue
                : false
            }
            onClick={termsAndConditionCheckBoxHandler}
          />{" "}
          Agree with Terms and Conditions
        </div>
      ) : null}
    </div>
  );
};

export default TermsAndConditions;
