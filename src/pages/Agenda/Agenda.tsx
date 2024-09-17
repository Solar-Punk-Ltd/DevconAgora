import React, { useEffect, useState } from "react";
import "./Agenda.scss";
import AgendaItem from "./AgendaItem/AgendaItem";
import TabPanel from "../../components/TabPanel/TabPanel";
import TabPanelItem from "../../components/TabPanel/TabPanelItem/TabPanelItem";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import FilterIcon from "../../components/icons/FilterIcon/FilterIcon";
import Categories from "../Categories/Categories";
import { Session } from "../../types/session";
import { shortenTitle } from "../../utils/helpers";
import { STAGES } from "../../utils/constants";

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
  maxSessionsShown?: number;
}
const Agenda: React.FC<AgendaProps> = ({ sessions, maxSessionsShown = 8 }) => {
  const [sessionsByDay, setSessionsByDay] = useState<Session[][]>([]);
  const [agendaItemsByDay, setAgendaItemsByDay] = useState<JSX.Element[][]>([]);
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

  // TODO: map stage names per day
  // TODO: map stage names per category
  const getStageNames = (): string[] => {
    const arr: string[] = [];
    for (const [key, value] of Object.entries(STAGES)) {
      arr.push(value);
    }
    return arr;
  };

  function filterSessionsByDay() {
    const sessionsByDayArray = new Array<Session[]>(sessionsByDayLength);
    for (let i = 0; i < sessionsByDayArray.length; i++) {
      sessionsByDayArray[i] = new Array<Session>();
    }
    for (let i = 0; i < sessions.length; i++) {
      const slotStart = sessions[i].slot_start;
      if (slotStart) {
        const day = new Date(slotStart).toDateString();
        let dayIndex = DAYS.DAY1;
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
        sessionsByDayArray[dayIndex].push(sessions[i]);
      }
    }

    setSessionsByDay(sessionsByDayArray);
  }

  const getItemsByDay = () => {
    const items = new Array<JSX.Element[]>(sessionsByDayLength);
    for (let i = 0; i < items.length; i++) {
      items[i] = new Array<JSX.Element>();
    }
    for (let n = 0; n < sessionsByDay.length; n++) {
      const dailySessions = sessionsByDay[n];
      for (let i = 0; i < maxSessionsShown && i < dailySessions.length; i++) {
        const sessionItem = dailySessions[i];
        const shortTitle = shortenTitle(sessionItem.title, 100);
        const randomBoolean = Math.random() >= 0.5;
        // TODO: format start/end times
        items[n].push(
          <AgendaItem
            key={sessionItem.id}
            title={shortTitle}
            startDate={sessionItem.slot_start}
            endDate={sessionItem.slot_end}
            category={sessionItem.track}
            // TODO: heart logic
            hearted={randomBoolean}
          />
        );
      }
    }

    setAgendaItemsByDay(items);
  };
  useEffect(() => {
    filterSessionsByDay();
  }, [sessions]);

  useEffect(() => {
    getItemsByDay();
  }, [sessionsByDay]);

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
          {renderTabPanelItems(getStageNames(), setActiveStageTab)}
        </TabPanel>
        {agendaItemsByDay[activeDayTab] ? agendaItemsByDay[activeDayTab] : null}
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
