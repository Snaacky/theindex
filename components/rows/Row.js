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
import IconBookmark from "../icons/IconBookmark"
import IconNewTabLink from "../icons/IconNewTabLink"
import IconStar from "../icons/IconStar"
import OnlineStatus from "../data/OnlineStatus"

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
    const hrefString = "/" + type + "/" + (content.urlId ?? content._id)

    if (typeof content === "undefined") {
        return <Loader/>
    }

    return <div className={styles.row + " card bg-2 mb-1"}>
        <div className="row g-0">
            {move !== null ?
                <div className={styles.sorter + " col-auto"}>
                    <a onClick={() => move(-1)}>
                        <FontAwesomeIcon icon={["fas", "chevron-up"]}/>
                    </a>
                    <a onClick={() => move(1)}>
                        <FontAwesomeIcon icon={["fas", "chevron-down"]}/>
                    </a>
                </div> : <></>
            }
            {add !== null ?
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
                    <Link href={"/" + type + "/" + content._id}>
                        <a title={"View " + type + " " + content.name}>
                            <Image src={imageUrl} className="img-fluid rounded-start"
                                   alt="..." width={64} height={64}/>
                        </a>
                    </Link>
                </div> : <></>}
            <div className="col">
                <div className={"card-body p-2"}>
                    <h5 className={styles.title + " card-title"}>
                        {typeof content.urls !== "undefined" ?
                            <OnlineStatus url={content.urls[0]}/> : <></>}
                        <Link href={hrefString}>
                            {content.name}
                        </Link>
                        {typeof content.urls !== "undefined" ? <IconNewTabLink url={content.urls[0]}/> : <></>}
                        {canEdit(session, type) ? <Link href={"/edit/" + type + "/" + content._id}>
                            <a title={"Edit " + type} className={"ms-2"}>
                                <IconEdit/>
                            </a>
                        </Link> : ""}
                        <span className={"float-end"} style={{fontSize: "1.2rem"}}>
                            {content.sponsor ?
                                <span className={"ms-2"}>
                                    <DataBadge name={"Sponsor"} style={"warning text-dark"}/>
                                </span> : <></>}
                            {content.nsfw ? <span className={"ms-2"}>
                                <DataBadge data={false} name={"NSFW"}/>
                            </span> : <></>}
                            {content.accountType ? <span className={"ms-2"}>
                                <DataBadge name={content.accountType} style={"primary"}/>
                            </span> : <></>}
                            {type === "item" ? <>
                                <span className={"ms-2"}>
                                    <IconStar item={content}/>
                                </span>
                                <span className={"ms-2"}>
                                    <IconBookmark item={content}/>
                                </span>
                            </> : <></>}
                        </span>
                    </h5>

                    <span className={styles.description + " card-text"}>
                        {content.description}
                    </span>

                    {bodyContent}
                </div>
            </div>
            {remove !== null ?
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
