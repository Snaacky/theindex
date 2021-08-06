import {Icon} from "react-icons-kit"
import {ic_mode_edit} from "react-icons-kit/md/ic_mode_edit"
import styles from "./IconEdit.module.css"
import iconStyles from "./Icon.module.css"

export default function IconEdit({size}) {
    return <div className={iconStyles.icon + " " + styles.edit}>
        <Icon icon={ic_mode_edit} size={size}/>
    </div>
}
