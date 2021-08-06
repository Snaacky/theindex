import {Icon} from "react-icons-kit"
import {ic_read_more} from "react-icons-kit/md/ic_read_more"
import iconStyles from "./Icon.module.css"

export default function IconItem({size}) {
    return <div className={iconStyles.icon + " rounded"}>
        <Icon icon={ic_read_more} size={size}/>
    </div>
}
