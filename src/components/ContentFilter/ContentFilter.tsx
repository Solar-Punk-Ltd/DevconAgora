import React, { useState } from "react";
import "./ContentFilter.scss";
import { CONTENT_FILTER_TEXT } from "../../utils/constants";
import CheckBoxIcon from "../icons/CheckBoxIcon/CheckBoxIcon";
import { useGlobalState } from "../../GlobalStateContext";

const ContentFilter: React.FC = () => {
  const { isContentFilterEnabled, setIsContentFilterEnabled } =
    useGlobalState();

  const [checked, setIsChecked] = useState<boolean>(isContentFilterEnabled);

  const handleClick = (isContentFilterEnabled: boolean, checked: boolean) => {
    setIsChecked(!checked);
    setIsContentFilterEnabled(!isContentFilterEnabled);
  };
  return (
    <div className="content-filter">
      <div className="content-filter__text">{CONTENT_FILTER_TEXT}</div>
      <div className="content-filter__setting">
        <CheckBoxIcon
          checked={checked}
          onClick={() => handleClick(isContentFilterEnabled, checked)}
        />
        <div className="content-filter__text__header">
          Content Filter enabled
        </div>
      </div>
    </div>
  );
};

export default ContentFilter;
