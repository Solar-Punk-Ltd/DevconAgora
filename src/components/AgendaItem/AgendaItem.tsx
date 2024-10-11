import React, { useState } from "react";
import "./AgendaItem.scss";
import HeartIcon from "../../components/icons/HeartIcon/HeartIcon";
import CategoryIndicator from "../../components/CategoryIndicator/CategoryIndicator";
import Stage from "../../components/Stage/Stage";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import { booleanToString, stringToBoolean } from "../../utils/helpers";

interface AgendaItemProps {
  id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  liked?: boolean;
  category?: string;
  roomId?: string;
  stage?: string;
  backgroundColor?: string;
  borderRadius?: string;
  paddingRight: string;
}

const AgendaItem: React.FC<AgendaItemProps> = ({
  id,
  title,
  startDate,
  endDate,
  liked,
  category,
  stage,
  backgroundColor,
  borderRadius,
  paddingRight,
}) => {
  const [empty, setEmpty] = useState(!liked);
  const handleClick = () => {
    const isLiked = stringToBoolean(localStorage.getItem(id));
    localStorage.setItem(id, booleanToString(!isLiked));
    setEmpty(isLiked);
  };

  return (
    <Link to={`${ROUTES.TALKS}/${id}`}>
      <div
        className="agenda-item"
        style={{ backgroundColor, borderRadius, paddingRight }}
      >
        <div className="agenda-item__main">
          <div className={"agenda-item__main__time"}>
            <div>{startDate}</div>
            <div>{endDate}</div>
          </div>
          <div className="agenda-item__main__content">
            <div className="agenda-item__main__content__title">{title}</div>
            <div className="agenda-item__main__content__tagged">
              {stage ? <Stage name={stage} /> : null}
              {category ? (
                <CategoryIndicator name={category || "no track"} />
              ) : null}
            </div>
          </div>
        </div>
        {/* use debounce if data is saved to swarm: debounce(handleClick, debounceTime) */}
        <div className="agenda-item__content__heart-icon">
          <HeartIcon
            empty={empty}
            onClick={() => {
              handleClick();
            }}
          />
        </div>
      </div>
    </Link>
  );
};

export default AgendaItem;
