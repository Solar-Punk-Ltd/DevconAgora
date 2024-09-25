import React from "react";
import "./NavigationFooter.scss";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "../icons/HomeIcon/HomeIcon";
import AgendaIcon from "../icons/AgendaIcon/AgendaIcon";
import RoomsIcon from "../icons/RoomsIcon/RoomsIcon";
import ChatTest from "../../assets/visitors-icon.svg";
import { ROUTES } from "../../utils/constants";
import clsx from "clsx";

const NavigationFooter: React.FC = () => {
  const location = useLocation();

  const getColor = (path: string) => {
    return location.pathname === path ? "#8C72AE" : "black";
  };
  return (
    <div className="navigation-footer">
      <Link to={ROUTES.HOME}>
        <div
          className={clsx("navigation-footer__item-container", {
            "navigation-footer__item-container__active":
              location.pathname === "/home",
          })}
        >
          <HomeIcon color={getColor("/home")} />
          <div>Home</div>
        </div>
      </Link>
      <Link to={ROUTES.AGENDA}>
        <div
          className={clsx("navigation-footer__item-container", {
            "navigation-footer__item-container__active":
              location.pathname === "/agenda",
          })}
        >
          <AgendaIcon color={getColor("/agenda")} />
          <div>Agenda</div>
        </div>
      </Link>
      <Link to="/spaces">
        <div
          className={clsx("navigation-footer__item-container", {
            "navigation-footer__item-container__active":
              location.pathname === "/spaces",
          })}
        >
          <RoomsIcon color={getColor("/spaces")} />
          <div>Spaces</div>
        </div>
      </Link>
      <Link to="/chat_dev">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <img src={ChatTest} alt="" width="24px" height="24px" />
          <div style={{ fontSize: "12px" }}>Chat</div>
        </div>
      </Link>
    </div>
  );
};

export default NavigationFooter;
