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
import AgendaItem from "../../components/AgendaItem/AgendaItem";
import {
  getSessionsByDay,
  dateToTime,
  stringToBoolean,
} from "../../utils/helpers";
import { useGlobalState } from "../../GlobalStateContext";
import HomeBackground from "../../assets/welcome-glass-effect.png";

const Agenda: React.FC = () => {
  const { sessions } = useGlobalState();
  const [activeAgendaItems, setActiveAgendaItems] = useState<Session[]>([]);
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [categoryIndex, setCategoryIndex] = useState<number | null>(null);
  const [activeAgendaTab, setActiveAgendaTab] = useState<number>(0);
  const [activeDayTab, setActiveDayTab] = useState<number>(0);
  const [activeStageTab, setActiveStageTab] = useState<number>(0);

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
        const categoryFilter =
          categoryIndex !== null
            ? sessionsByDay[i].track === CATEGORIES[categoryIndex]
            : true;
        const isLiked = stringToBoolean(
          localStorage.getItem(sessionsByDay[i].id)
        );
        sessionsByDay[i].liked = isLiked;
        const isYourAgenda = activeAgendaTab === 1 ? isLiked === true : true;

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

  // TODO: all vs agenda naming ?
  return !showCategories ? (
    <div className="agenda-page">
      <div className="agenda-page__upper-tab-panel">
        <TabPanel version="underlined" activeIndex={activeAgendaTab}>
          {renderTabPanelItems(["All", "Your Agenda"], setActiveAgendaTab)}
        </TabPanel>
        <TabPanel version="filled" activeIndex={activeDayTab}>
          {renderTabPanelItems(
            Array.from(DATE_TO_DEVCON_DAY.values()),
            setActiveDayTab
          )}
        </TabPanel>
      </div>
      <div className="agenda-page__content__wrapper">
        <div className="agenda-page__content__background">
          <img
            src={HomeBackground}
            alt=""
            width="100%"
            height="100%"
            className="agenda-page__content__background__img"
          />
        </div>
      </div>
      <div className="agenda-page__content">
        <Dropdown
          items={Array.from(STAGES_MAP.values())}
          activeItem={activeStageTab}
          onClick={(index) => setActiveStageTab(index)}
        />
        {activeAgendaItems.map((session) => {
          return (
            <AgendaItem
              key={session.id}
              id={session.id}
              title={session.title}
              startDate={dateToTime(session.slot_start)}
              endDate={dateToTime(session.slot_end)}
              category={session.track}
              roomId={session.slot_roomId}
              liked={session.liked}
              paddingRight={"16px"}
            />
          );
        })}
        <div className="agenda-page__content__filter-icon">
          <FilterIcon onClick={() => setShowCategories(true)} />
        </div>
      </div>
      <NavigationFooter />
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
