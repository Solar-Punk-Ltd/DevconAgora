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
  backgroundColor?: string;
  borderRadius?: string;
  paddingRight: string;
  onHeartClick: () => boolean;
  onTitleClick?: () => void;
}

const AgendaItem: React.FC<AgendaItemProps> = ({
  title,
  startDate,
  endDate,
  liked,
  category,
  stage,
  backgroundColor,
  borderRadius,
  paddingRight,
  onHeartClick,
  onTitleClick,
}) => {
  const [empty, setEmpty] = useState(!liked);
  // const debounceTime = 1000;
  const handleClick = () => {
    const isLiked = onHeartClick();
    setEmpty(!isLiked);
  };

  return (
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
          <div
            className="agenda-item__main__content__title"
            onClick={onTitleClick}
          >
            {title}
          </div>
          <div style={{}} className="agenda-item__main__content__tagged">
            {stage ? <Stage name={stage} /> : null}
            {category ? (
              <CategoryIndicator name={category || "no track"} />
            ) : null}
          </div>
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
