import React from "react";
import "./ActiveVisitors.scss";
import VisitorsIcon from "../icons/VisitorsIcon/VisitorsIcon";
import clsx from "clsx";

interface ActiveVisitorsProps {
  number?: number;
  withIcon?: boolean;
  activity?: boolean;
}

const ActiveVisitors: React.FC<ActiveVisitorsProps> = ({
  number,
  withIcon,
  activity,
}) => {
  return (
    <div
      className={clsx("active-visitors", {
        "active-visitors__with-icon": withIcon,
      })}
    >
      {withIcon ? <VisitorsIcon /> : null}
      {number}
      {!withIcon ? (activity ? " activity" : " active visitors") : null}
    </div>
  );
};

export default ActiveVisitors;
