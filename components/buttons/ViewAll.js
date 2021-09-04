import Link from "next/link"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export default function ViewAll({type}) {
    return <Link href={"/" + type}>
        <a className={"btn btn-outline-secondary"}>
            View all {type}
            <FontAwesomeIcon icon={["fas", "arrow-alt-circle-right"]} className={"ms-2"}/>
        </a>
    </Link>
}