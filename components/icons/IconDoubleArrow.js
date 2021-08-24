import {Icon} from "react-icons-kit"
import {ic_double_arrow} from "react-icons-kit/md/ic_double_arrow"
import iconStyles from "./Icon.module.css"

export default function IconDoubleArrow({size}) {
    return <div className={iconStyles.icon + " rounded"}>
        <Icon icon={ic_double_arrow} size={size}/>
    </div>
}
