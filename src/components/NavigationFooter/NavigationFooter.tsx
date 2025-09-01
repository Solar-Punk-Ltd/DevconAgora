import clsx from "clsx";
import React from "react";
import { Link, useLocation } from "react-router-dom";

import { ROUTES } from "../../utils/constants";
import AgendaIcon from "../icons/AgendaIcon/AgendaIcon";
import HomeIcon from "../icons/HomeIcon/HomeIcon";
import NotesIcon from "../icons/NotesIcon/NotesIcon";
import RoomsIcon from "../icons/RoomsIcon/RoomsIcon";

import "./NavigationFooter.scss";

const NavigationFooter: React.FC = () => {
  const location = useLocation();

  const getColor = (path: string) => {
    return location.pathname === path ? "var(--default-purple)" : "black";
  };
  return (
    <div className="navigation-footer">
      <Link to={ROUTES.HOME}>
        <div
          className={clsx("navigation-footer__item-container", {
            "navigation-footer__item-container__active": location.pathname === ROUTES.HOME,
          })}
        >
          <HomeIcon color={getColor(ROUTES.HOME)} />
          <div>Home</div>
        </div>
      </Link>
      <Link to={ROUTES.AGENDA}>
        <div
          className={clsx("navigation-footer__item-container", {
            "navigation-footer__item-container__active": location.pathname === ROUTES.AGENDA,
          })}
        >
          <AgendaIcon color={getColor(ROUTES.AGENDA)} />
          <div>Agenda</div>
        </div>
      </Link>
      <Link to={ROUTES.SPACES}>
        <div
          className={clsx("navigation-footer__item-container", {
            "navigation-footer__item-container__active": location.pathname === ROUTES.SPACES,
          })}
        >
          <RoomsIcon color={getColor(ROUTES.SPACES)} />
          <div>Spaces</div>
        </div>
      </Link>
      <Link to={ROUTES.NOTES}>
        <div
          className={clsx("navigation-footer__item-container", {
            "navigation-footer__item-container__active": location.pathname === ROUTES.NOTES,
          })}
        >
          <NotesIcon color={getColor(ROUTES.NOTES)} />
          <div>Notes</div>
        </div>
      </Link>
    </div>
  );
};

export default NavigationFooter;
