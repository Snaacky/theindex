import Image from "next/image"
import Link from "next/link"
import {useSession} from "next-auth/client"
import {canEdit} from "../../lib/session";
import IconEdit from "../icons/IconEdit";
import styles from "./TableCard.module.css"

export default function TableCard({table}) {
    const [session] = useSession()

    return <div className={styles.card + " card bg-2 mb-2 me-2"}>
        <div className="row g-0">
            <div className="col-auto p-1">
                <Image src={table.img ? table.img : "/img/puzzled.png"} className="img-fluid rounded-start"
                       alt="..." width={128} height={128}/>
            </div>
            <div className="col">
                <div className={"card-body"}>
                    <h5 className={"card-title"}>
                        <Link href={"/table/" + table.urlId}>
                            {table.title}
                        </Link>
                        {canEdit(session) ? <Link href={"/edit/table/" + table.urlId}>
                            <a title={"Edit table"}>
                                <IconEdit/>
                            </a>
                        </Link> : ""}
                    </h5>

                    <p className={styles.description + " card-text"}>
                        {table.description}
                    </p>
                </div>
            </div>
        </div>
    </div>
}
