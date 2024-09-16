import React from "react";
import "./AgendaItem.scss";
import CategoryIndicator from "../../../components/CategoryIndicator/CategoryIndicator";
import HeartIcon from "../../../components/icons/HeartIcon/HeartIcon";

interface AgendaItemProps {
  name?: string;
  startDate?: string;
  endDate?: string;
  hearted?: boolean;
}

const AgendaItem: React.FC<AgendaItemProps> = ({
  name,
  startDate,
  endDate,
  hearted,
}) => {
  return (
    <div className="agenda-item">
      <div className={"agenda-item__time"}>
        <div style={{ fontSize: "12px", fontWeight: "400" }}>{startDate}</div>
        <div style={{ fontSize: "12px", fontWeight: "400" }}>{endDate}</div>
      </div>
      <div className="agenda-item__content">
        <div className="agenda-item__content__name">{name}</div>
        <div className="agenda-item__content__category">
          <CategoryIndicator name="Layer 2s" />
        </div>
      </div>
      <div style={{ width: "24px", paddingRight: "9px" }}>
        <HeartIcon empty={!hearted} />
      </div>
    </div>
  );
};

export default AgendaItem;
