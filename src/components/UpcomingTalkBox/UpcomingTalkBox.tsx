import "./UpcomingTalkBox.scss"
import UpcomingTalkBoxItem from "./UpcomingTalkBoxItem/UpcomingTalkBoxItem"
import { useEffect, useState } from "react"
import {
  BEE_API_URL,
  TALK_5_HASH,
  ADDRESS_HEX_LENGTH,
} from "../../utils/constants"
import { Swarm } from "libswarm"
import { Session } from "../../types/session"

interface UpcomingTalkBoxProps {}

const UpcomingTalkBox: React.FC<UpcomingTalkBoxProps> = ({}) => {
  const [isBeeRunning, setBeeRunning] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [postageStamp, setPostageStamp] = useState<string>("")

  async function getSessions(hash: string) {
    if (hash.length !== ADDRESS_HEX_LENGTH) {
      console.log("session hash invalid")
      return
    }

    try {
      const s = (await swarm.downloadRawData(hash, "application/json")).utf8
      const session: Session = JSON.parse(s)
      setSessions(sessions.concat(session))
      console.log("session", session)
    } catch (e) {
      console.log("talk " + hash + " download/cast error", e)
    }
  }

  const swarm = new Swarm({
    beeApi: BEE_API_URL,
  })

  async function checkBee() {
    fetch(BEE_API_URL + "addresses")
      .then(async () => {
        if (!isBeeRunning) {
          setBeeRunning(true)
          console.log("Bee is running")
        }
        if (postageStamp.length === 0) {
          const stamp = await swarm.getUsableStamp()
          if (stamp === null) {
            console.log("No usable postage stamp found")
          } else {
            setPostageStamp(stamp)
            console.log("Usable postage stamp found: " + stamp)
          }
        }
      })
      .catch(() => {
        setBeeRunning(false)
        setPostageStamp("")
        console.log("Bee stopped running")
      })
  }

  useEffect(() => {
    checkBee()
    const interval = setInterval(() => {
      checkBee()
    }, 5000)

    if (sessions.length === 0) {
      getSessions(TALK_5_HASH)
    }
    return () => clearInterval(interval)
  }, [])

  const titles = []
  for (let i = 0; i < sessions.length; i++) {
    titles.push(
      <UpcomingTalkBoxItem key={sessions[i].id} title={sessions[i].title} />
    )
  }
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {titles}
      </div>
    </div>
  )
}

export default UpcomingTalkBox
