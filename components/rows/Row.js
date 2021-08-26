import Link from "next/link"
import Image from "next/image"
import {useSession} from "next-auth/client"
import {canEdit} from "../../lib/session"
import styles from "./Row.module.css"
import IconAdd from "../icons/IconAdd"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import IconDelete from "../icons/IconDelete"
import IconEdit from "../icons/IconEdit"
import DataBadge from "../data/DataBadge"
import Loader from "../loading"

export default function Row(
    {
        type,
        content,
        imageUrl = "",
        bodyContent = null,
        move = null,
        add = null,
        remove = null
    }) {

    const [session] = useSession()
    const hrefString = type + "/" + (type !== "item" ? content.urlId : content._id)

    if (typeof content === "undefined") {
        return <Loader/>
    }

    return <div className={styles.row + " card bg-2 mb-2"}>
        <div className="row g-0">
            {canEdit(session, type) && move !== null ?
                <div className={styles.sorter + " col-auto"}>
                    <a onClick={() => move(-1)}>
                        <FontAwesomeIcon icon={["fas", "chevron-up"]}/>
                    </a>
                    <a onClick={() => move(1)}>
                        <FontAwesomeIcon icon={["fas", "chevron-down"]}/>
                    </a>
                </div> : <></>
            }
            {canEdit(session, type) && add !== null ?
                <div className={styles.sorter + " col-auto"}>
                    <a onClick={add} title={"Add " + type} style={{
                        height: "32px"
                    }}>
                        <IconAdd/>
                    </a>
                </div> : <></>
            }
            {imageUrl !== "" ?
                <div className={styles.column + " col-auto p-1"}>
                    <Image src={imageUrl} className="img-fluid rounded-start"
                           alt="..." width={64} height={64}/>
                </div> : <></>}
            <div className="col">
                <div className={"card-body"}>
                    <h5 className={"card-title"}>
                        <Link href={hrefString}>
                            {content.name}
                        </Link>
                        {canEdit(session, type) ? <Link href={"/edit/" + hrefString}>
                            <a title={"Edit " + type} className={"ms-2"}>
                                <IconEdit/>
                            </a>
                        </Link> : ""}
                        <span className={"float-end"} style={{fontSize: "1.2rem"}}>
                            {content.sponsor ?
                                <span className={"ms-2"}>
                                    <DataBadge title={"Sponsor"} style={"warning text-dark"}/>
                                </span> : <></>}
                            {content.nsfw ? <span className={"ms-2"}>
                                <DataBadge data={false} title={"NSFW"}/>
                            </span> : <></>}
                        </span>
                    </h5>

                    <span className={styles.description + " card-text"}>
                        {content.description}
                    </span>

                    {bodyContent}
                </div>
            </div>
            {canEdit(session, type) && remove !== null ?
                <div className={styles.column + " col-auto p-1"}>
                    <a onClick={remove} title={"Remove " + type} className={"float-end"} style={{
                        width: "42px",
                        height: "42px"
                    }}>
                        <IconDelete/>
                    </a>
                </div> : ""}
        </div>
    </div>
}
