import Link from "next/link"
import Image from "next/image"
import {useSession} from "next-auth/client"
import {canEdit} from "../../lib/session"
import styles from "./Card.module.css"
import IconEdit from "../icons/IconEdit"
import IconDelete from "../icons/IconDelete"
import IconAdd from "../icons/IconAdd"
import IconNewTabLink from "../icons/IconNewTabLink"
import DataBadge from "../data/DataBadge"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Loader from "../loading"

export default function Card(
    {
        type,
        content,
        url = "",
        imageUrl = "",
        bodyContent = null,
        add = null,
        remove = null,
        move = null
    }) {

    const [session] = useSession()
    const hrefString = type + "/" + (type !== "item" ? content.urlId : content._id)

    if (typeof content === "undefined") {
        return <Loader/>
    }

    return <div className={styles.card + " card bg-2 mb-2 me-2"}>
        <div className="row g-0">
            {canEdit(session, type) && move !== null ? <div className={styles.sorter + " col-auto"}>
                <a onClick={() => move(-1)}>
                    <FontAwesomeIcon icon={["fas", "chevron-up"]}/>
                </a>
                <a onClick={() => move(1)}>
                    <FontAwesomeIcon icon={["fas", "chevron-down"]}/>
                </a>
            </div> : <></>}
            {imageUrl !== "" ? <div className={"col-auto p-1"}>
                <Image src={imageUrl} className="img-fluid rounded-start" alt="..." width={128} height={128}/>
            </div> : <></>}
            <div className="col">
                <div className={"card-body p-2"}>
                    <h5 className={"card-title"}>
                        <Link href={"/" + hrefString}>
                            <a title={"View " + type + " " + content.name}>
                                {content.name}
                            </a>
                        </Link>
                        {url !== "" ? <IconNewTabLink url={url}/> : <></>}
                        {canEdit(session, type) ? <>
                            <Link href={"/edit/" + hrefString}>
                                <a title={"Edit " + type} className={"ms-2"}>
                                    <IconEdit/>
                                </a>
                            </Link>
                        </> : ""}
                        <span className={styles.action}>
                            {content.sponsor ?
                                <span className={"ms-2"}>
                                    <DataBadge name={"Sponsor"} style={"warning text-dark"}/>
                                </span> : <></>}
                            {content.nsfw ?
                                <span className={"ms-2"}>
                                    <DataBadge data={false} name={"NSFW"}/>
                                </span> : <></>
                            }
                            {canEdit(session, type) ? <>
                                {add !== null ?
                                    <a title={"Add " + type} className={styles.link + " float-end"} onClick={add}>
                                        <IconAdd/>
                                    </a> : <></>}
                                {remove !== null ?
                                    <a title={"Delete " + type} className={styles.link + " float-end"}
                                       onClick={remove}>
                                        <IconDelete/>
                                    </a> : <></>}
                            </> : ""}
                        </span>
                    </h5>

                    <span className={styles.description + " card-text"}>
                        {content.description}
                    </span>
                    {bodyContent !== null ? bodyContent : <></>}
                </div>
            </div>
        </div>
    </div>
}
