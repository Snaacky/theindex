import {Icon} from "react-icons-kit"
import {wrench} from 'react-icons-kit/fa/wrench'
import styles from "./IconAdmin.module.css";

export default function IconAdmin({size}) {
    return <div className={styles.admin + " rounded"}>
        <Icon icon={wrench} size={size}/>
    </div>
}
