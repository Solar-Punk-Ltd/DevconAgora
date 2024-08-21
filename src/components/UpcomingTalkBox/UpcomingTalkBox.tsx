import "./UpcomingTalkBox.scss"
import UpcomingTalkBoxItem from "./UpcomingTalkBoxItem/UpcomingTalkBoxItem"
import React from "react"
import { Session } from "../../types/session"

interface UpcomingTalkBoxProps {
  sessions: Session[]
}

const UpcomingTalkBox: React.FC<UpcomingTalkBoxProps> = ({ sessions }) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div>Upcoming talks</div>
        <div style={{ textDecoration: "underline" }}>All</div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          overflowX: "scroll",
          whiteSpace: "nowrap",
        }}
      >
        {sessions.length === 0 ? (
          <UpcomingTalkBoxItem key={"notalk"} title={"No upcoming talks"} />
        ) : (
          <UpcomingTalkBoxItem key={sessions[0].id} title={sessions[0].title} />
        )}
      </div>
    </div>
  )
}

export default UpcomingTalkBox
