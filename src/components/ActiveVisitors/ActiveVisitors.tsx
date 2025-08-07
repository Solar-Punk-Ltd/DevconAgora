import clsx from "clsx";
import React from "react";

import VisitorsIcon from "../icons/VisitorsIcon/VisitorsIcon";

import "./ActiveVisitors.scss";

interface ActiveVisitorsProps {
  number?: bigint;
  withIcon?: boolean;
}

const ActiveVisitors: React.FC<ActiveVisitorsProps> = ({ number, withIcon }) => {
  return (
    <div
      className={clsx("active-visitors", {
        "active-visitors__with-icon": withIcon,
      })}
    >
      {withIcon ? <VisitorsIcon /> : null}
      {Number(number)}
      {!withIcon ? " activity" : null}
    </div>
  );
};

export default ActiveVisitors;
