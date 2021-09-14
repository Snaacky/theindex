import Link from "next/link"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import styles from "./ViewAllButton.module.css"

export default function ViewAllButton({type}) {
    return <Link href={"/" + type}>
        <a className={"btn btn-outline-secondary"}>
            View all <span className={styles.type}>{type}</span>
            <FontAwesomeIcon icon={["fas", "arrow-alt-circle-right"]} className={"ms-2"}/>
        </a>
    </Link>
}
