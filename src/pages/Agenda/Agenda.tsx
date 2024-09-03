import React from "react";
import "./Agenda.scss";
import AgendaItem from "./AgendaItem/AgendaItem";

const Agenda: React.FC = () => {
  return (
    <div>
      <AgendaItem
        name="Ethereum for the next billion: DeFi for the unbanked/underbanked"
        startDate="9:00 AM"
        endDate="10:15 AM"
      />
      <AgendaItem
        name="Ethereum for the next billion: DeFi for the unbanked/underbanked"
        startDate="9:00 AM"
        endDate="10:15 AM"
      />
      <AgendaItem
        name="Ethereum for the next billion: DeFi for the unbanked/underbanked"
        startDate="9:00 AM"
        endDate="10:15 AM"
      />
      <AgendaItem
        name="Ethereum for the next billion: DeFi for the unbanked/underbanked"
        startDate="9:00 AM"
        endDate="10:15 AM"
      />
    </div>
  );
};

export default Agenda;
