import React, { useEffect, useState } from "react";
import "./Agenda.scss";
import AgendaItem from "./AgendaItem/AgendaItem";
import TabPanel from "../../components/TabPanel/TabPanel";
import TabPanelItem from "../../components/TabPanel/TabPanelItem/TabPanelItem";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import FilterIcon from "../../components/icons/FilterIcon/FilterIcon";
import Categories from "../Categories/Categories";
import { Session } from "../../types/session";
import { shortenTitle, dateToTime } from "../../utils/helpers";
import { STAGES_MAP, DAYS_MAP, CATEGORY_FILTERS } from "../../utils/constants";

interface AgendaProps {
  sessions: Session[];
}

const Agenda: React.FC<AgendaProps> = ({ sessions }) => {
  const [agendaItemsByDay, setAgendaItemsByDay] = useState<JSX.Element[][]>([]);
  const [activeAgendaItems, setActiveAgendaItems] = useState<JSX.Element[]>([]);
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

  function filterSessionsByDay() {
    const agendaItemsByDayArray = new Array<JSX.Element[]>(
      Array.from(DAYS_MAP.keys()).length
    );
    for (let i = 0; i < agendaItemsByDayArray.length; i++) {
      agendaItemsByDayArray[i] = new Array<JSX.Element>();
    }
    for (let i = 0; i < sessions.length; i++) {
      const slotStart = sessions[i].slot_start;
      if (slotStart) {
        const day = new Date(slotStart).toDateString();
        let dayIndex = -1;
        switch (day) {
          case DAYS_MAP.get("Day 1"):
            dayIndex = 0;
            break;
          case DAYS_MAP.get("Day 2"):
            dayIndex = 1;
            break;
          case DAYS_MAP.get("Day 3"):
            dayIndex = 2;
            break;
          case DAYS_MAP.get("Day 4"):
            dayIndex = 3;
            break;
          default:
            console.log("unkown day: ", day);
            break;
        }
        const sessionItem = sessions[i];
        const shortTitle = shortenTitle(sessionItem.title);
        const randomBoolean = Math.random() >= 0.5;
        if (dayIndex !== -1) {
          agendaItemsByDayArray[dayIndex].push(
            <AgendaItem
              key={sessionItem.id}
              title={shortTitle}
              startDate={dateToTime(sessionItem.slot_start)}
              endDate={dateToTime(sessionItem.slot_end)}
              category={sessionItem.track}
              roomId={sessionItem.slot_roomId}
              hearted={randomBoolean}
            />
          );
        }
      }
    }

    setAgendaItemsByDay(agendaItemsByDayArray);
  }

  useEffect(() => {
    if (sessions.length != 0) {
      filterSessionsByDay();
    }
  }, [sessions]);

  useEffect(() => {
    if (agendaItemsByDay.length > 0) {
      const activeItemsArray: JSX.Element[] = [];
      for (let i = 0; i < agendaItemsByDay[activeDayTab].length; i++) {
        const items = agendaItemsByDay[activeDayTab];
        const categoryFilter = categoryIndex
          ? items[i].props.category === CATEGORY_FILTERS[categoryIndex]
          : true;
        const isYourAgenda =
          activeAgendaTab === 1 ? items[i].props.hearted === true : true;

        if (
          items[i].props.roomId ===
            Array.from(STAGES_MAP.keys())[activeStageTab] &&
          isYourAgenda &&
          categoryFilter
        ) {
          activeItemsArray.push(items[i]);
        }
      }
      setActiveAgendaItems(activeItemsArray);
    }
  }, [
    agendaItemsByDay,
    activeDayTab,
    activeStageTab,
    activeAgendaTab,
    categoryIndex,
  ]);

  return !showCategories ? (
    <div className="agenda-page">
      <div className="agenda-page__upper-tab-panel">
        <TabPanel version="underlined" activeIndex={activeAgendaTab}>
          {renderTabPanelItems(["Agenda", "Your Agenda"], setActiveAgendaTab)}
        </TabPanel>
        <TabPanel version="filled" activeIndex={activeDayTab}>
          {renderTabPanelItems(Array.from(DAYS_MAP.keys()), setActiveDayTab)}
        </TabPanel>
      </div>
      <div className="agenda-page__content">
        <TabPanel version="outlined" activeIndex={activeStageTab}>
          {renderTabPanelItems(
            Array.from(STAGES_MAP.values()),
            setActiveStageTab
          )}
        </TabPanel>
        {activeAgendaItems}
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
