import React from "react";
import "./AgendaItem.scss";
import CategoryIndicator from "../../../components/CategoryIndicator/CategoryIndicator";
import HeartIcon from "../../../components/icons/HeartIcon/HeartIcon";

interface AgendaItemProps {
  title?: string;
  startDate?: string;
  endDate?: string;
  track?: string;
  hearted?: boolean;
}

const AgendaItem: React.FC<AgendaItemProps> = ({
  title,
  startDate,
  endDate,
  track,
  hearted,
}) => {
  return (
    <div className="agenda-item">
      <div className={"agenda-item__time"}>
        <div style={{ fontSize: "12px", fontWeight: "400" }}>{startDate}</div>
        <div style={{ fontSize: "12px", fontWeight: "400" }}>{endDate}</div>
      </div>
      <div className="agenda-item__content">
        <div className="agenda-item__content__name">{title}</div>
        <div className="agenda-item__content__category">
          <CategoryIndicator name={track || "no track"} />
        </div>
      </div>
      <div style={{ width: "24px", paddingRight: "9px" }}>
        <HeartIcon empty={!hearted} />
      </div>
    </div>
  );
};

export default AgendaItem;
