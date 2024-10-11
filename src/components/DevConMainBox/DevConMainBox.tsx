import React from "react";
import "./DevConMainBox.scss";
import { Link } from "react-router-dom";
import ActiveVisitors from "../ActiveVisitors/ActiveVisitors";
import clsx from "clsx";
import { ROUTES } from "../../utils/constants";

const LOBBY_TOPIC = "lobby::test";

interface DevConMainBoxProps {
  title: string;
  content?: string;
  showActiveVisitors?: boolean;
  activeVisitors?: number;
  bordered?: boolean;
  setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>
}

const DevConMainBox: React.FC<DevConMainBoxProps> = ({
  title,
  content,
  showActiveVisitors,
  activeVisitors,
  bordered,
  setSelectedChat
}) => {
  return (
    <div onClick={() => setSelectedChat(LOBBY_TOPIC)} >
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
    </div>
  );
};

export default DevConMainBox;
