import {Icon} from "react-icons-kit"
import {wrench} from "react-icons-kit/fa/wrench"
import styles from "./IconAdmin.module.css"
import iconStyles from "./Icon.module.css"

export default function IconAdmin({size}) {
    return <div className={iconStyles.icon + " " + styles.admin + " rounded"}>
        <Icon icon={wrench} size={size}/>
    </div>
}
