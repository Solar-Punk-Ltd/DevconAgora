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

const DEVCON_DAY1 = new Date("2022-10-11").toDateString();
const DEVCON_DAY2 = new Date("2022-10-12").toDateString();
const DEVCON_DAY3 = new Date("2022-10-13").toDateString();
const DEVCON_DAY4 = new Date("2022-10-14").toDateString();

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
  const [agenda, setAgenda] = useState<JSX.Element[]>([]);
  const [day1Sessions, setDay1Sessions] = useState<Session[]>([]);
  const [day2Sessions, setDay2Sessions] = useState<Session[]>([]);
  const [day3Sessions, setDay3Sessions] = useState<Session[]>([]);
  const [day4Sessions, setDay4Sessions] = useState<Session[]>([]);
  const [day1Items, setDay1Items] = useState<JSX.Element[]>([]);
  const [day2Items, setDay2Items] = useState<JSX.Element[]>([]);
  const [day3Items, setDay3Items] = useState<JSX.Element[]>([]);
  const [day4Items, setDay4Items] = useState<JSX.Element[]>([]);

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

  function filterForDays() {
    const tmpDay1Sessions: Session[] = [];
    const tmpDay2Sessions: Session[] = [];
    const tmpDay3Sessions: Session[] = [];
    const tmpDay4Sessions: Session[] = [];
    for (let i = 0; i < sessions.length; i++) {
      const slotStart = sessions[i].slot_start;
      if (slotStart) {
        const day = new Date(slotStart).toDateString();
        switch (day) {
          case DEVCON_DAY1:
            tmpDay1Sessions.push(sessions[i]);
            break;
          case DEVCON_DAY2:
            tmpDay2Sessions.push(sessions[i]);
            break;
          case DEVCON_DAY3:
            tmpDay3Sessions.push(sessions[i]);
            break;
          case DEVCON_DAY4:
            tmpDay4Sessions.push(sessions[i]);
            break;
          default:
            console.log("unkown day: ", day);
            break;
        }
      }
    }
    setDay1Sessions(tmpDay1Sessions);
    setDay2Sessions(tmpDay2Sessions);
    setDay3Sessions(tmpDay3Sessions);
    setDay4Sessions(tmpDay4Sessions);
  }

  const filterDays = (day: DAYS) => {
    let arr = [];
    switch (day) {
      case DAYS.DAY1:
        arr = day1Sessions;
        break;
      case DAYS.DAY2:
        arr = day2Sessions;
        break;
      case DAYS.DAY3:
        arr = day3Sessions;
        break;
      case DAYS.DAY4:
        arr = day4Sessions;
        break;
      default:
        arr = day1Sessions;
        break;
    }
    const items = new Array<JSX.Element>(maxSessionsShown);
    for (let i = 0; i < maxSessionsShown && i < arr.length; i++) {
      const shortTitle = shortenTitle(arr[i].title);
      const randomBoolean = Math.random() >= 0.5;
      // console.log("bagoy shortTitle:", shortTitle);
      items[i] = (
        <AgendaItem
          key={arr[i].id}
          title={shortTitle}
          // TODO: format start/end times
          startDate={arr[i].slot_start}
          endDate={arr[i].slot_end}
          category={arr[i].track}
          // TODO: heart logic
          hearted={randomBoolean}
        />
      );
    }
    return items;
  };

  useEffect(() => {
    filterForDays();
  }, [sessions]);

  useEffect(() => {
    setDay1Items(filterDays(DAYS.DAY1));
    setDay2Items(filterDays(DAYS.DAY2));
    setDay3Items(filterDays(DAYS.DAY3));
    setDay4Items(filterDays(DAYS.DAY4));
  }, [day1Sessions]);

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
              title="Ethereum for the next billion: DeFi for the unbanked/underbanked"
              startDate="9:00 AM"
              endDate="10:15 AM"
              hearted={true}
              category="Layer 2s"
            />
            <AgendaItem
              title="Ethereum for the next billion: DeFi for the unbanked/underbanked"
              startDate="9:00 AM"
              endDate="10:15 AM"
              hearted={false}
              category="Layer 2s"
            />
            <AgendaItem
              title="Ethereum for the next billion: DeFi for the unbanked/underbanked"
              startDate="9:00 AM"
              endDate="10:15 AM"
              hearted={true}
              category="Layer 2s"
            />
            <AgendaItem
              title="Ethereum for the next billion: DeFi for the unbanked/underbanked"
              startDate="9:00 AM"
              endDate="10:15 AM"
              hearted={false}
              category="Layer 2s"
            />
          </div>
        ) : (
          <div className="agenda-page__content__items">
            <AgendaItem
              title="Ethereum for the next billion: DeFi for the unbanked/underbanked"
              startDate="9:00 AM"
              endDate="10:15 AM"
              hearted={true}
              category="Cypherpunk and privacy"
              stage="Stage 1"
            />
            <AgendaItem
              title="Ethereum for the next billion: DeFi for the unbanked/underbanked"
              startDate="9:00 AM"
              endDate="10:15 AM"
              hearted={true}
              category="Cypherpunk and privacy"
              stage="Stage 1"
            />
            <AgendaItem
              title="Ethereum for the next billion: DeFi for the unbanked/underbanked"
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
