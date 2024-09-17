import React, { useState } from "react";
import "./Agenda.scss";
import AgendaItem from "./AgendaItem/AgendaItem";
import TabPanel from "../../components/TabPanel/TabPanel";
import TabPanelItem from "../../components/TabPanel/TabPanelItem/TabPanelItem";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import FilterIcon from "../../components/icons/FilterIcon/FilterIcon";
import Categories from "../Categories/Categories";

const Agenda: React.FC = () => {
  const [showCategories, setShowCategories] = useState(false);
  const [categoryIndex, setCategoryIndex] = useState<number | null>(null);
  const [activeAgendaTab, setActiveAgendaTab] = useState(0);
  const [activeDayTab, setActiveDayTab] = useState(0);
  const [activeStageTab, setActiveStageTab] = useState(0);

  const renderTabPanelItems = (
    labels: string[],
    handleClick: (index: number) => void
  ) => {
    return labels.map((label, index) => (
      <TabPanelItem
        key={label}
        label={label}
        handleClick={() => handleClick(index)}
      />
    ));
  };

  return !showCategories ? (
    <div className="agenda-page">
      <div className="agenda-page__upper-tab-panel">
        <TabPanel version="underlined" activeIndex={activeAgendaTab}>
          {renderTabPanelItems(["Agenda", "Your Agenda"], setActiveAgendaTab)}
        </TabPanel>
        <TabPanel version="filled" activeIndex={activeDayTab}>
          {renderTabPanelItems(
            ["Day 1", "Day 2", "Day 3", "Day 4"],
            setActiveDayTab
          )}
        </TabPanel>
      </div>
      <div className="agenda-page__content">
        <TabPanel version="outlined" activeIndex={activeStageTab}>
          {renderTabPanelItems(
            ["Stage 1", "Stage 2", "Stage 3", "Stage 4"],
            setActiveStageTab
          )}
        </TabPanel>
        {activeAgendaTab === 0 ? (
          <div className="agenda-page__content__items">
            <AgendaItem
              name="Ethereum for the next billion: DeFi for the unbanked/underbanked"
              startDate="9:00 AM"
              endDate="10:15 AM"
              hearted={true}
              category="Layer 2s"
            />
            <AgendaItem
              name="Ethereum for the next billion: DeFi for the unbanked/underbanked"
              startDate="9:00 AM"
              endDate="10:15 AM"
              hearted={false}
              category="Layer 2s"
            />
            <AgendaItem
              name="Ethereum for the next billion: DeFi for the unbanked/underbanked"
              startDate="9:00 AM"
              endDate="10:15 AM"
              hearted={true}
              category="Layer 2s"
            />
            <AgendaItem
              name="Ethereum for the next billion: DeFi for the unbanked/underbanked"
              startDate="9:00 AM"
              endDate="10:15 AM"
              hearted={false}
              category="Layer 2s"
            />
          </div>
        ) : (
          <div className="agenda-page__content__items">
            <AgendaItem
              name="Ethereum for the next billion: DeFi for the unbanked/underbanked"
              startDate="9:00 AM"
              endDate="10:15 AM"
              hearted={true}
              category="Cypherpunk and privacy"
              stage="Stage 1"
            />
            <AgendaItem
              name="Ethereum for the next billion: DeFi for the unbanked/underbanked"
              startDate="9:00 AM"
              endDate="10:15 AM"
              hearted={true}
              category="Cypherpunk and privacy"
              stage="Stage 1"
            />
            <AgendaItem
              name="Ethereum for the next billion: DeFi for the unbanked/underbanked"
              startDate="9:00 AM"
              endDate="10:15 AM"
              hearted={true}
              category="Cypherpunk and privacy"
              stage="Stage 1"
            />
          </div>
        )}

        <NavigationFooter />
        <div className="agenda-page__content__filter-icon">
          <FilterIcon onClick={() => setShowCategories(true)} />
        </div>
      </div>
    </div>
  ) : (
    <Categories
      display={showCategories}
      handleCategories={(a: boolean, selectedCategoryIndex: number | null) => {
        setShowCategories(a);
        setCategoryIndex(selectedCategoryIndex);
      }}
      selectedCategoryIndex={categoryIndex}
    />
  );
};

export default Agenda;
