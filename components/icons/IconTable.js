import {Icon} from "react-icons-kit"
import {listUl} from "react-icons-kit/fa/listUl"
import iconStyles from "./Icon.module.css"

export default function IconTable({size}) {
    return <div className={iconStyles.icon + " rounded"}>
        <Icon icon={listUl} size={size}/>
    </div>
}
