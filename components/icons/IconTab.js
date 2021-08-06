import {Icon} from "react-icons-kit"
import {folderO} from "react-icons-kit/fa/folderO"
import iconStyles from "./Icon.module.css"

export default function IconTab({size}) {
    return <div className={iconStyles.icon + " rounded"}>
        <Icon icon={folderO} size={size}/>
    </div>
}
