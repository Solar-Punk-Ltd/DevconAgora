import React from "react";
import "./NavigationFooter.scss";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "../icons/HomeIcon/HomeIcon";
import AgendaIcon from "../icons/AgendaIcon/AgendaIcon";
import RoomsIcon from "../icons/RoomsIcon/RoomsIcon";
import clsx from "clsx";

const NavigationFooter: React.FC = () => {
  const location = useLocation();

  const getColor = (path: string) => {
    return location.pathname === path ? "#8C72AE" : "black";
  };
  return (
    <div className="navigation-footer">
      <Link to="/home">
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
      <Link to="/agenda">
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
      <Link to="/rooms">
        <div
          className={clsx("navigation-footer__item-container", {
            "navigation-footer__item-container__active":
              location.pathname === "/rooms",
          })}
        >
          <RoomsIcon color={getColor("/rooms")} />
          <div>Rooms</div>
        </div>
      </Link>
    </div>
  );
};

export default NavigationFooter;
