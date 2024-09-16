import React from "react";
import "./Agenda.scss";
import AgendaItem from "./AgendaItem/AgendaItem";
import TabPanel from "../../components/TabPanel/TabPanel";
import TabPanelItem from "../../components/TabPanel/TabPanelItem/TabPanelItem";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";

const Agenda: React.FC = () => {
  return (
    <div className="agenda-page">
      <div className="agenda-page__upper-tab-panel">
        <TabPanel version="underlined">
          <TabPanelItem label="Agenda" />
          <TabPanelItem label="Your agenda" />
        </TabPanel>
        <TabPanel version="filled">
          <TabPanelItem label="Day 1" />
          <TabPanelItem label="Day 2" />
          <TabPanelItem label="Day 3" />
          <TabPanelItem label="Day 4" />
        </TabPanel>
      </div>
      <div className="agenda-page__content">
        <TabPanel version="outlined">
          <TabPanelItem label="Stage 1" />
          <TabPanelItem label="Stage 2" />
          <TabPanelItem label="Stage 3" />
          <TabPanelItem label="Stage 4" />
        </TabPanel>
        <div className="agenda-page__content__items">
          <AgendaItem
            name="Ethereum for the next billion: DeFi for the unbanked/underbanked"
            startDate="9:00 AM"
            endDate="10:15 AM"
            hearted={true}
          />
          <AgendaItem
            name="Ethereum for the next billion: DeFi for the unbanked/underbanked"
            startDate="9:00 AM"
            endDate="10:15 AM"
            hearted={false}
          />
          <AgendaItem
            name="Ethereum for the next billion: DeFi for the unbanked/underbanked"
            startDate="9:00 AM"
            endDate="10:15 AM"
            hearted={true}
          />
          <AgendaItem
            name="Ethereum for the next billion: DeFi for the unbanked/underbanked"
            startDate="9:00 AM"
            endDate="10:15 AM"
            hearted={false}
          />
        </div>
      </div>
      <NavigationFooter />
    </div>
  );
};

export default Agenda;
