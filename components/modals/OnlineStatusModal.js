import Modal from "./Modal"
import styles from "../data/OnlineStatus.module.css"

export default function OnlineStatusModal({style, text, url, data, close}) {
    let pingStyle = styles.status + " "

    return <Modal
        close={close}
        head={url ? <>
            Online status of <kbd className={"text-primary"}>{url}</kbd>
        </> : "No url provided to check anything"
        }
        body={
            <div className={"container-fluid"}>
                <div className={"mb-2"}>
                    <span className={"me-2"}>
                        Result:
                    </span>
                    <div className={style}/>
                    <kbd>
                        {text}
                    </kbd>
                </div>
                <div className={"mt-3"}>
                    <h4>
                        Possible states are:
                    </h4>
                    <ul className={"list-unstyled"}>
                        <li>
                            <div className={pingStyle + styles.up}/>
                            Host is online
                        </li>
                        <li>
                            <div className={pingStyle + styles.unknown}/>
                            Up-status of host could not be determined
                        </li>
                        <li>
                            <div className={pingStyle + styles.down}/>
                            Host is offline
                        </li>
                        <li>
                            <div className={pingStyle + styles.error}/>
                            Error occurred while fetching the ping API
                        </li>
                        <li>
                            <div className={pingStyle + styles.ping}/>
                            Still waiting for request to ping API to finish
                        </li>
                    </ul>
                </div>
            </div>
        }
        footer={data && data.time ?
            <span className={"text-muted"}>
                Checked at <kbd><code>{new Date(data.time).toLocaleTimeString()}</code></kbd>
            </span> : <></>
        }
    />
}
