import React from "react";
import "./DevConMainBox.scss";
import { Link } from "react-router-dom";
import ActiveVisitors from "../ActiveVisitors/ActiveVisitors";
import clsx from "clsx";

interface DevConMainBoxProps {
  title: string;
  content?: string;
  showActiveVisitors?: boolean;
  activeVisitors?: number;
  bordered?: boolean;
}

const DevConMainBox: React.FC<DevConMainBoxProps> = ({
  title,
  content,
  showActiveVisitors,
  activeVisitors,
  bordered,
}) => {
  return (
    <Link to="/devconlounge">
      <div
        className={clsx("devcon-main-box", {
          "devcon-main-box__border": bordered,
        })}
      >
        <div className="devcon-main-box__title">{title}</div>
        {content ? (
          <div className="devcon-main-box__content">{content}</div>
        ) : null}
        {showActiveVisitors ? <ActiveVisitors number={activeVisitors} /> : null}
      </div>
    </Link>
  );
};

export default DevConMainBox;
