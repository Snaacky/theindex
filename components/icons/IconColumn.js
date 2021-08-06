import {Icon} from "react-icons-kit"
import {ic_table_chart} from "react-icons-kit/md/ic_table_chart"
import iconStyles from "./Icon.module.css"

export default function IconColumn({size}) {
    return <div className={iconStyles.icon + " rounded"}>
        <Icon icon={ic_table_chart} size={size}/>
    </div>
}
