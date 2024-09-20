import React from "react";
import "./AgendaItem.scss";
import HeartIcon from "../../../components/icons/HeartIcon/HeartIcon";
import CategoryIndicator from "../../../components/CategoryIndicator/CategoryIndicator";
import Stage from "../../../components/Stage/Stage";

interface AgendaItemProps {
  name?: string;
  startDate?: string;
  endDate?: string;
  hearted?: boolean;
  category?: string;
  stage?: string;
}

const AgendaItem: React.FC<AgendaItemProps> = ({
  name,
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
        <div className="agenda-item__content__name">{name}</div>
        <div style={{}} className="agenda-item__content__tagged">
          {stage ? <Stage name={stage} /> : null}
          {category ? <CategoryIndicator name={category} /> : null}
        </div>
      </div>
      <div className="agenda-item__content__heart-icon">
        <HeartIcon empty={!hearted} />
      </div>
    </div>
  );
};

export default AgendaItem;
