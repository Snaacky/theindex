import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import styles from "./IconSponsor.module.css"

export default function IconSponsor({size}) {
    return <FontAwesomeIcon icon={["fas", "medal"]} size={size} className={styles.sponsor} title={"Sponsor"}/>
}
