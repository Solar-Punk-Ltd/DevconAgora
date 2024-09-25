import React, { useEffect, useState } from "react";
import "./Agenda.scss";
import TabPanel from "../../components/TabPanel/TabPanel";
import TabPanelItem from "../../components/TabPanel/TabPanelItem/TabPanelItem";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import FilterIcon from "../../components/icons/FilterIcon/FilterIcon";
import Categories from "../Categories/Categories";
import Dropdown from "../../components/Dropdown/Dropdown";
import { Session } from "../../types/session";
import {
  STAGES_MAP,
  CATEGORIES,
  DATE_TO_DEVCON_DAY,
} from "../../utils/constants";
import { getSessionsByDay, dateToTime } from "../../utils/helpers";
import AgendaItem from "../../components/AgendaItem/AgendaItem";

interface AgendaProps {
  sessions: Map<string, Session[]>;
}

const Agenda: React.FC<AgendaProps> = ({ sessions }) => {
  const [activeAgendaItems, setActiveAgendaItems] = useState<Session[]>([]);
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

  useEffect(() => {
    const sessionsByDay = getSessionsByDay(
      sessions,
      Array.from(DATE_TO_DEVCON_DAY.keys())[activeDayTab]
    );
    if (sessionsByDay.length > 0) {
      const items: Session[] = [];
      for (let i = 0; i < sessionsByDay.length; i++) {
        const categoryFilter = categoryIndex
          ? sessionsByDay[i].track === CATEGORIES[categoryIndex]
          : true;
        // TODO: implement heart logic
        const isYourAgenda =
          activeAgendaTab === 1 ? sessionsByDay[i].hearted === true : true;

        if (
          sessionsByDay[i].slot_roomId ===
            Array.from(STAGES_MAP.keys())[activeStageTab] &&
          isYourAgenda &&
          categoryFilter
        ) {
          items.push(sessionsByDay[i]);
        }
      }
      setActiveAgendaItems(items);
    }
  }, [sessions, activeDayTab, activeStageTab, activeAgendaTab, categoryIndex]);

  return !showCategories ? (
    <div className="agenda-page">
      <div className="agenda-page__upper-tab-panel">
        <TabPanel version="underlined" activeIndex={activeAgendaTab}>
          {renderTabPanelItems(["Agenda", "Your Agenda"], setActiveAgendaTab)}
        </TabPanel>
        <TabPanel version="filled" activeIndex={activeDayTab}>
          {renderTabPanelItems(
            Array.from(DATE_TO_DEVCON_DAY.values()),
            setActiveDayTab
          )}
        </TabPanel>
      </div>
      <div className="agenda-page__content">
        <Dropdown
          items={Array.from(STAGES_MAP.values())}
          activeItem={activeStageTab}
          onClick={(index) => setActiveStageTab(index)}
        />
        {activeAgendaItems.map((session) => {
          const randomBoolean = Math.random() >= 0.5;
          return (
            <AgendaItem
              key={session.id}
              title={session.title}
              startDate={dateToTime(session.slot_start)}
              endDate={dateToTime(session.slot_end)}
              category={session.track}
              roomId={session.slot_roomId}
              hearted={randomBoolean}
            />
          );
        })}
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
