import {Icon} from "react-icons-kit"
import {externalLink} from 'react-icons-kit/fa/externalLink'
import iconStyles from "./Icon.module.css"

export default function IconLink({size}) {
    return <div className={iconStyles.icon + " rounded"}>
        <Icon icon={externalLink} size={size}/>
    </div>
}
