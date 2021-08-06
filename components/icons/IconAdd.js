import {Icon} from "react-icons-kit"
import {ic_add} from "react-icons-kit/md/ic_add"
import styles from "./IconAdd.module.css"

export default function IconAdd({size}) {
    return <div className={styles.add + " rounded"}>
        <Icon icon={ic_add} size={size}/>
    </div>
}
