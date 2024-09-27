import React, { useState } from "react";
import "./AgendaItem.scss";
import HeartIcon from "../../components/icons/HeartIcon/HeartIcon";
import CategoryIndicator from "../../components/CategoryIndicator/CategoryIndicator";
import Stage from "../../components/Stage/Stage";

interface AgendaItemProps {
  title: string;
  startDate?: string;
  endDate?: string;
  liked?: boolean;
  category?: string;
  roomId?: string;
  stage?: string;
  onClick: () => boolean;
  backgroundColor?: string;
  borderRadius?: string;
  paddingRight: string;
}
const AgendaItem: React.FC<AgendaItemProps> = ({
  title,
  startDate,
  endDate,
  liked,
  category,
  stage,
  onClick,
  backgroundColor,
  borderRadius,
  paddingRight,
}) => {
  const [empty, setEmpty] = useState(!liked);
  // const debounceTime = 1000;
  const handleClick = () => {
    const isLiked = onClick();
    setEmpty(!isLiked);
  };

  return (
    <div
      className="agenda-item"
      style={{ backgroundColor, borderRadius, paddingRight }}
    >
      <div className={"agenda-item__time"}>
        <div>{startDate}</div>
        <div>{endDate}</div>
      </div>
      <div className="agenda-item__content">
        <div className="agenda-item__content__title">{title}</div>
        <div style={{}} className="agenda-item__content__tagged">
          {stage ? <Stage name={stage} /> : null}
          {category ? (
            <CategoryIndicator name={category || "no track"} />
          ) : null}
        </div>
      </div>
      {/* TODO: use debounce if data is saved to swarm: debounce(handleClick, debounceTime) */}
      <div className="agenda-item__content__heart-icon" onClick={handleClick}>
        <HeartIcon empty={empty} />
      </div>
    </div>
  );
};

export default AgendaItem;
