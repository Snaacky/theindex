import {Icon} from "react-icons-kit"
import {ic_mode_edit} from "react-icons-kit/md/ic_mode_edit"
import styles from "./IconEdit.module.css"

export default function IconEdit({size}) {
    return <div className={styles.edit}>
        <Icon icon={ic_mode_edit} size={size}/>
    </div>
}
