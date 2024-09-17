import React from "react";
import { useEffect, useState } from "react";
import "./Agenda.scss";
import AgendaItem from "./AgendaItem/AgendaItem";
import TabPanel from "../../components/TabPanel/TabPanel";
import TabPanelItem from "../../components/TabPanel/TabPanelItem/TabPanelItem";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
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
          track={arr[i].track}
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
          {day3Items.length === 0 ? (
            <AgendaItem key={"no-agenda"} title={"No agenda"} />
          ) : (
            day3Items
          )}
        </div>
      </div>
      <NavigationFooter />
    </div>
  );
};

export default Agenda;
