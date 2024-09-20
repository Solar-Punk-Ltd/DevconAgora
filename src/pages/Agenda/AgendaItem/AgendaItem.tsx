import React from "react";
import "./AgendaItem.scss";
import HeartIcon from "../../../components/icons/HeartIcon/HeartIcon";
import CategoryIndicator from "../../../components/CategoryIndicator/CategoryIndicator";
import Stage from "../../../components/Stage/Stage";

interface AgendaItemProps {
  title?: string;
  startDate?: string;
  endDate?: string;
  hearted?: boolean;
  category?: string;
  roomId?: string;
  stage?: string;
}
const AgendaItem: React.FC<AgendaItemProps> = ({
  title,
  startDate,
  endDate,
  hearted,
  category,
  stage,
}) => {
  return (
    <div className="agenda-item">
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
      <div className="agenda-item__content__heart-icon">
        <HeartIcon empty={!hearted} />
      </div>
    </div>
  );
};

export default AgendaItem;
