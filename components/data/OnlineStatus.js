import useSWR from "swr"
import {useState} from "react"
import styles from "./OnlineStatus.module.css"
import OnlineStatusModal from "../modals/OnlineStatusModal"

export default function OnlineStatus({url}) {
    let {data, error} = useSWR("https://ping.piracy.moe/ping", (u) => fetch(u, {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            url: url || "https://piracy.moe"
        })
    }).then(res => res.json()))
    const [show, setShow] = useState(false)

    let style = "", text = ""
    if (error) {
        style = styles.error
        text = error.toString()
    } else if (!url) {
        style = styles.down
        text = "No url found to ping"
    } else {
        if (!data) {
            style = styles.ping
            text = "Fetching online status"
        } else if (data.status === "down") {
            style = styles.down
            text = "Host is offline"
        } else if (data.status === "up") {
            style = styles.up
            text = "Host is online"
        } else if (data.status === "unknown") {
            style = styles.unknown
            text = "Could not determine host up-status"
        }
    }

    style = styles.status + " " + style
    return <>
        <span className={style} onClick={() => setShow(true)}
              title={text + (data && url ? ", last checked " + new Date(parseInt(data.time) * 1000).toLocaleTimeString() : "")}/>
        {show ? <OnlineStatusModal url={url} style={style} text={text} data={data} close={() => setShow(false)}/>
            : <></>}
    </>
}
