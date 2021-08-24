import Link from "next/link"
import {useSession} from "next-auth/client"
import {canEdit} from "../../lib/session"
import IconEdit from "../icons/IconEdit"
import styles from "./TableCard.module.css"
import IconLink from "../icons/IconLink";
import BoolValue from "../data/bool-value";
import ArrayValue from "../data/array-value";

export default function ItemCard(
    {
        item,
        columns = []
    }) {
    const [session] = useSession()

    let columnYes = [], columnNo = [], columnUnknown = [], columnArray = []
    columns.forEach(c => {
        c = c.data
        if (c.type === "bool") {
            if (item.data[c._id] === true) {
                columnYes.push(c)
            } else if (item.data[c._id] === false) {
                columnNo.push(c)
            } else {
                columnUnknown.push(c)
            }
        } else if (c.type === "array") {
            columnArray.push(c)
        }
    })
    console.log("No-array:", columnNo, "raw data:", item.data)

    return <div className={styles.card + " card bg-2 mb-2 me-2"}>
        <div className={"card-body" +
        (columnYes.length > 0 || columnUnknown.length > 0 || columnNo.length > 0 || columnArray.length > 0 ? " pb-1" : "")}>
            <h5 className={"card-title"}>
                <Link href={"/item/" + item._id}>
                    <a title={"View item " + item.title}>
                        {item.title}
                    </a>
                </Link>
                <a className={"mx-2"} target={"_blank"} href={item.urls[0]} rel="noreferrer" title={"Open in new tab"}>
                    <IconLink/>
                </a>
                {canEdit(session) ? <Link href={"/edit/item/" + item._id}>
                    <a title={"Edit item"}>
                        <IconEdit/>
                    </a>
                </Link> : ""}
            </h5>

            <p className={styles.description + " card-text"}>
                {item.description}
            </p>
        </div>
        {columnYes.length > 0 ?
            <div className={"d-flex flex-wrap mx-3 mb-1"}>
                {columnYes.map(c => {
                    return <BoolValue data={true} column={c} key={c._id}/>
                })}
            </div> : <></>
        }
        {columnUnknown.length > 0 ?
            <div className={"d-flex flex-wrap mx-3 mb-1"}>
                {columnUnknown.map(c => {
                    return <BoolValue column={c} key={c._id}/>
                })}
            </div> : <></>
        }
        {columnNo.length > 0 ?
            <div className={"d-flex flex-wrap mx-3 mb-1"}>
                {columnNo.map(c => {
                    return <BoolValue data={false} column={c} key={c._id}/>
                })}
            </div> : <></>
        }
        {columnArray.length > 0 ?
            <div className={"d-flex flex-wrap mx-3 mb-1"}>
                {columnArray.map(c => {
                    return <>
                        <Link href={"/column/" + c.urlId}>
                            <a className={"me-2"} title={"View column " + c.title}>
                                {c.title}:
                            </a>
                        </Link>
                        <ArrayValue data={item.data[c._id] || []} column={c} key={c._id}/>
                    </>
                })}
            </div> : <></>
        }
        {columnYes.length > 0 || columnUnknown.length > 0 || columnNo.length > 0 || columnArray.length > 0 ?
            <div className={"mt-3"}/> : <></>
        }
    </div>
}
