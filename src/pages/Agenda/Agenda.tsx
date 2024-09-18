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
import { STAGES_MAP, CATEGORY_FILTERS } from "../../utils/constants";

const DEVCON_DAY_AS_DATE1 = new Date("2022-10-11").toDateString();
const DEVCON_DAY_AS_DATE2 = new Date("2022-10-12").toDateString();
const DEVCON_DAY_AS_DATE3 = new Date("2022-10-13").toDateString();
const DEVCON_DAY_AS_DATE4 = new Date("2022-10-14").toDateString();

enum DAYS {
  DAY1 = 0,
  DAY2 = 1,
  DAY3 = 2,
  DAY4 = 3,
}

interface AgendaProps {
  sessions: Session[];
}

// TODO: arrange items by recency
// TODO: align roomIds with names: talk vs session ? -> workshops ?
const Agenda: React.FC<AgendaProps> = ({ sessions }) => {
  const [agendaItemsByDay, setAgendaItemsByDay] = useState<JSX.Element[][]>([]);
  const [activeAgendaItems, setActiveAgendaItems] = useState<JSX.Element[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [categoryIndex, setCategoryIndex] = useState<number | null>(null);
  const [activeAgendaTab, setActiveAgendaTab] = useState(0);
  const [activeDayTab, setActiveDayTab] = useState(0);
  const [activeStageTab, setActiveStageTab] = useState(0);

  const sessionsByDayLength = 4;

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
    const agendaItemsByDayArray = new Array<JSX.Element[]>(sessionsByDayLength);
    for (let i = 0; i < agendaItemsByDayArray.length; i++) {
      agendaItemsByDayArray[i] = new Array<JSX.Element>();
    }
    for (let i = 0; i < sessions.length; i++) {
      const slotStart = sessions[i].slot_start;
      if (slotStart) {
        const day = new Date(slotStart).toDateString();
        let dayIndex = -1;
        switch (day) {
          case DEVCON_DAY_AS_DATE1:
            dayIndex = DAYS.DAY1;
            break;
          case DEVCON_DAY_AS_DATE2:
            dayIndex = DAYS.DAY2;
            break;
          case DEVCON_DAY_AS_DATE3:
            dayIndex = DAYS.DAY3;
            break;
          case DEVCON_DAY_AS_DATE4:
            dayIndex = DAYS.DAY4;
            break;
          default:
            console.log("unkown day: ", day);
            break;
        }
        const sessionItem = sessions[i];
        const shortTitle = shortenTitle(sessionItem.title, 100);
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
      const activeItemsArray = [];
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
          {renderTabPanelItems(
            ["Day 1", "Day 2", "Day 3", "Day 4"],
            setActiveDayTab
          )}
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
