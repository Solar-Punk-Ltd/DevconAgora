import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

import CategoryIndicator from "../../components/CategoryIndicator/CategoryIndicator";
import HeartIcon from "../../components/icons/HeartIcon/HeartIcon";
import Stage from "../../components/Stage/Stage";
import { ROUTES } from "../../utils/constants";
import { booleanToString, stringToBoolean } from "../../utils/helpers";

import "./AgendaItem.scss";

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
  commentVersion?: boolean;
  isSpacesTalk?: boolean;
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
  commentVersion,
  isSpacesTalk,
}) => {
  const [empty, setEmpty] = useState<boolean>(!liked);
  const navigate = useNavigate();
  useEffect(() => {
    const isLiked = stringToBoolean(localStorage.getItem(id));
    setEmpty(!isLiked);
  }, []);

  const handleClick = () => {
    const isLiked = stringToBoolean(localStorage.getItem(id));
    localStorage.setItem(id, booleanToString(!isLiked));
    setEmpty(isLiked);
  };

  return (
    <div
      className={clsx("agenda-item", {
        "agenda-item__comment-version": commentVersion,
      })}
      style={{ backgroundColor, borderRadius, paddingRight }}
      onClick={() => {
        if (!commentVersion) {
          navigate(`${ROUTES.TALKS}/${id}`);
        }
      }}
    >
      <div
        className={clsx(
          "agenda-item__main",
          isSpacesTalk ? "agenda-item-padded__main" : ""
        )}
      >
        {!isSpacesTalk && (
          <div
            className={clsx("agenda-item__main__time", {
              "agenda-item__main__time__comment-version": commentVersion,
            })}
          >
            <div>{startDate}</div>
            <div>{endDate}</div>
          </div>
        )}
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
      {!isSpacesTalk && (
        <div className="agenda-item__content__heart-icon">
          <HeartIcon
            empty={empty}
            onClick={() => {
              handleClick();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AgendaItem;
