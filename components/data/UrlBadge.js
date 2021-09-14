import styles from "./UrlBadge.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {isValidUrl} from "../../lib/utils"

export default function UrlBadge({url}) {
    if (isValidUrl(url)) {
        return <a href={url} target={"_blank"} rel={"noreferrer"}
                  className={"me-2 mb-2"}>
            <div className={styles.badge + " badge rounded-pill"}>
                {url}
                <span className={"ms-2"}>
                    <FontAwesomeIcon icon={["fas", "external-link-alt"]}/>
                </span>
            </div>
        </a>
    }

    return <div className={styles.badge + " badge rounded-pill bg-outline-danger me-2 mb-2"}>
        {url}
        <span className={"ms-2"}>
            <FontAwesomeIcon icon={["fas", "external-link-alt"]}/>
        </span>
    </div>
}
