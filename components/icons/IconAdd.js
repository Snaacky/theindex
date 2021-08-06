import {Icon} from "react-icons-kit"
import {ic_add} from "react-icons-kit/md/ic_add"
import styles from "./IconAdd.module.css"
import iconStyles from "./Icon.module.css"

export default function IconAdd({size}) {
    return <div className={iconStyles.icon + " " + styles.add + " rounded"}>
        <Icon icon={ic_add} size={size}/>
    </div>
}
