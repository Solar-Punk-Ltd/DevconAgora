import clsx from "clsx";
import React, { useEffect, useState } from "react";

import AgendaBanner from "../../assets/side-event-banner.png";
import AgendaItem from "../../components/AgendaItem/AgendaItem";
import Dropdown from "../../components/Dropdown/Dropdown";
import FilterIcon from "../../components/icons/FilterIcon/FilterIcon";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import TabPanel from "../../components/TabPanel/TabPanel";
import TabPanelItem from "../../components/TabPanel/TabPanelItem/TabPanelItem";
import { CATEGORIES, DATE_TO_DEVCON_DAY, STAGES_MAP } from "../../constants/categories";
import { useGlobalState } from "../../contexts/global";
import { Session } from "../../types/session";
import Categories from "../Categories/Categories";

import "./Agenda.scss";

import { stringToBoolean } from "@/utils/common";
import { dateToTime } from "@/utils/date";
import { getSessionsByDay } from "@/utils/session";

const Agenda: React.FC = () => {
  const { sessions } = useGlobalState();
  const [activeAgendaItems, setActiveAgendaItems] = useState<Session[]>([]);
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [categoryIndex, setCategoryIndex] = useState<number | null>(null);
  const [activeAgendaTab, setActiveAgendaTab] = useState<number>(0);
  const [activeDayTab, setActiveDayTab] = useState<number>(0);
  const [activeStageTab, setActiveStageTab] = useState<number>(STAGES_MAP.size - 1);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const renderTabPanelItems = (labels: string[], handleClick: (index: number) => void) => {
    return labels.map((label, index) => <TabPanelItem key={label} label={label} handleClick={() => handleClick(index)} />);
  };

  const changesWhenOpenDropdown = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
  };

  useEffect(() => {
    let day = "all";
    if (activeDayTab > 0) {
      day = Array.from(DATE_TO_DEVCON_DAY.keys())[activeDayTab - 1];
    }
    const sessionsByDay = getSessionsByDay(sessions, day);

    const items: Session[] = [];
    if (sessionsByDay.length > 0) {
      for (let i = 0; i < sessionsByDay.length; i++) {
        const categoryFilter = categoryIndex !== null ? sessionsByDay[i].track === CATEGORIES[categoryIndex] : true;
        const isLiked = stringToBoolean(localStorage.getItem(sessionsByDay[i].id));
        sessionsByDay[i].liked = isLiked;
        const isYourAgenda = activeAgendaTab === 1 ? isLiked === true : true;

        const stageId = Array.from(STAGES_MAP.keys())[activeStageTab];
        if ((sessionsByDay[i].slot_roomId === stageId || stageId === "all") && isYourAgenda && categoryFilter) {
          items.push(sessionsByDay[i]);
        }
      }
    }
    setActiveAgendaItems(items);
  }, [sessions, activeDayTab, activeStageTab, activeAgendaTab, categoryIndex]);

  return !showCategories ? (
    <div className="agenda-page">
      <div className="agenda-page__upper-tab-panel">
        <TabPanel version="underlined" activeIndex={activeAgendaTab}>
          {renderTabPanelItems(["Agenda", "My Agenda"], setActiveAgendaTab)}
        </TabPanel>
        <TabPanel version="filled" activeIndex={activeDayTab}>
          {renderTabPanelItems(["All", ...Array.from(DATE_TO_DEVCON_DAY.values())], setActiveDayTab)}
        </TabPanel>
      </div>
      <div className="agenda-page__content__background grid"></div>
      <div
        className={clsx("agenda-page__content", {
          "not-scroll": isDropdownOpen,
        })}
      >
        <Dropdown
          items={Array.from(STAGES_MAP.values())}
          activeItem={activeStageTab}
          onClick={(index) => setActiveStageTab(index)}
          changesWhenOpen={changesWhenOpenDropdown}
        />
        <a href="https://luma.com/yqfm7arf">
          <div className="agenda-page__content__banner">
            <img src={AgendaBanner} alt="" className="agenda-page__content__banner__img" />
            <div className="agenda-page__content__banner__text__register-button">Register now!</div>
          </div>
        </a>
        {activeAgendaItems.length > 0 ? (
          activeAgendaItems.map((session) => {
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
          })
        ) : (
          <div className="agenda-page__content__empty">No talk found</div>
        )}
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
