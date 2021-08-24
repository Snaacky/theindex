import styles from "./IconDelete.module.css"
import iconStyles from "./Icon.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export default function IconDelete({size}) {
    return <div className={iconStyles.icon + " " + styles.delete + " rounded"}>
        <FontAwesomeIcon icon={["fas", "trash-alt"]} size={size}/>
    </div>
}
