import React from "react";
import "./DevConMainBox.scss";
import { Link } from "react-router-dom";
import ActiveVisitors from "../ActiveVisitors/ActiveVisitors";

interface DevConMainBoxProps {
  title: string;
  content?: string;
  showActiveVisitors?: boolean;
  activeVisitors?: number;
}

const DevConMainBox: React.FC<DevConMainBoxProps> = ({
  title,
  content,
  showActiveVisitors,
  activeVisitors,
}) => {
  return (
    <Link to="/devconlounge">
      <div className="devcon-main-box">
        <div className="devcon-main-box__title">{title}</div>
        <div className="devcon-main-box__content">{content}</div>
        {showActiveVisitors ? <ActiveVisitors number={activeVisitors} /> : null}
      </div>
    </Link>
  );
};

export default DevConMainBox;
