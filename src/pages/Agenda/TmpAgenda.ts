// import React from "react";
// import { useEffect, useState } from "react";
// import "./Agenda.scss";
// import AgendaItem from "./AgendaItem/AgendaItem";
// import TabPanel from "../../components/TabPanel/TabPanel";
// import TabPanelItem from "../../components/TabPanel/TabPanelItem/TabPanelItem";
// import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
// import { Session } from "../../types/session";
// import { shortenTitle } from "../../utils/helpers";

// const DEVCON_DAY1 = new Date("2022-10-11").toDateString();
// const DEVCON_DAY2 = new Date("2022-10-12").toDateString();
// const DEVCON_DAY3 = new Date("2022-10-13").toDateString();
// const DEVCON_DAY4 = new Date("2022-10-14").toDateString();

// enum DAYS {
//   DAY1 = 0,
//   DAY2 = 1,
//   DAY3 = 2,
//   DAY4 = 3,
// }

// interface AgendaProps {
//   sessions: Session[];
//   maxSessionsShown?: number;
// }

// const Agenda: React.FC<AgendaProps> = ({ sessions, maxSessionsShown = 8 }) => {
//   const [sessionsByDay, setSessionsByDay] = useState<Session[][]>([]);
//   // const [day2Sessions, setDay2Sessions] = useState<Session[]>([]);
//   // const [day3Sessions, setDay3Sessions] = useState<Session[]>([]);
//   // const [day4Sessions, setDay4Sessions] = useState<Session[]>([]);
//   const [itemsByDay, setItemsByDay] = useState<JSX.Element[][]>([]);
//   // const [day2Items, setDay2Items] = useState<JSX.Element[]>([]);
//   // const [day31Items, setDay3Items] = useState<JSX.Element[]>([]);
//   // const [day4Items, setDay4Items] = useState<JSX.Element[]>([]);

//   function filterSessionsByDay() {
//     const tmpSessionsByDay = new Array<Session[]>(4);
//     for (let i = 0; i < tmpSessionsByDay.length; i++) {
//       tmpSessionsByDay[i] = new Array<Session>();
//     }
//     // const tmpDay1Sessions: Session[] = [];
//     // const tmpDay2Sessions: Session[] = [];
//     // const tmpDay3Sessions: Session[] = [];
//     // const tmpDay4Sessions: Session[] = [];
//     for (let i = 0; i < sessions.length; i++) {
//       const slotStart = sessions[i].slot_start;
//       if (slotStart) {
//         const day = new Date(slotStart).toDateString();
//         let dayIndex = DAYS.DAY1;
//         switch (day) {
//           case DEVCON_DAY1:
//             dayIndex = DAYS.DAY1;
//             break;
//           case DEVCON_DAY2:
//             dayIndex = DAYS.DAY2;
//             break;
//           case DEVCON_DAY3:
//             dayIndex = DAYS.DAY3;
//             break;
//           case DEVCON_DAY4:
//             dayIndex = DAYS.DAY4;
//             break;
//           default:
//             console.log("unkown day: ", day);
//             break;
//         }
//         tmpSessionsByDay[dayIndex].push(sessions[i]);
//       }
//     }

//     setSessionsByDay(tmpSessionsByDay);
//     // setDay2Sessions(tmpDay2Sessions);
//     // setDay3Sessions(tmpDay3Sessions);
//     // setDay4Sessions(tmpDay4Sessions);
//   }

//   const getItemsByDay = () => {
//     const items = new Array<JSX.Element[]>(4);
//     for (let i = 0; i < items.length; i++) {
//       items[i] = new Array<JSX.Element>();
//     }
//     for (let n = 0; n < sessionsByDay.length; n++) {
//       const dailySessions = sessionsByDay[n];
//       for (let i = 0; i < maxSessionsShown && i < dailySessions.length; i++) {
//         const sessionItem = dailySessions[i];
//         const shortTitle = shortenTitle(sessionItem.title);
//         const randomBoolean = Math.random() >= 0.5;
//         console.log("bagoy shortTitle:", shortTitle);
//         // TODO: format start/end times
//         items[n].push(
//           <AgendaItem
//             key={sessionItem.id}
//             title={shortTitle}
//             startDate={sessions[i].slot_start}
//             endDate={sessionItem.slot_end}
//             tags={sessionItem.tags}
//             // TODO: heart logic
//             hearted={randomBoolean}
//           />
//         );
//       }
//     }

//     setItemsByDay(items);
//   };

//   useEffect(() => {
//     filterSessionsByDay();
//   }, [sessions]);

//   useEffect(() => {
//     getItemsByDay();
//     // setDay2Items(filterItemsForDays());
//     // setDay3Items(filterItemsForDays());
//     // setDay4Items(filterItemsForDays());
//   }, [sessionsByDay]);

//   return (
//     <div className="agenda-page">
//       <div className="agenda-page__upper-tab-panel">
//         <TabPanel version="underlined">
//           <TabPanelItem label="Agenda" />
//           <TabPanelItem label="Your agenda" />
//         </TabPanel>
//         <TabPanel version="filled">
//           <TabPanelItem label="Day 1" />
//           <TabPanelItem label="Day 2" />
//           <TabPanelItem label="Day 3" />
//           <TabPanelItem label="Day 4" />
//         </TabPanel>
//       </div>
//       <div className="agenda-page__content">
//         <TabPanel version="outlined">
//           <TabPanelItem label="Stage 1" />
//           <TabPanelItem label="Stage 2" />
//           <TabPanelItem label="Stage 3" />
//           <TabPanelItem label="Stage 4" />
//         </TabPanel>
//         <div className="agenda-page__content__items">
//           {itemsByDay.length === 0 ? (
//             <AgendaItem key={"no-agenda"} title={"No agenda"} />
//           ) : (
//             itemsByDay[DAYS.DAY1]
//           )}
//         </div>
//       </div>
//       <NavigationFooter />
//     </div>
//   );
// };

// export default Agenda;
