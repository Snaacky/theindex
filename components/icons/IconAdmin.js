import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export default function IconItem({size}) {
    return <FontAwesomeIcon icon={["fas", "wrench"]} size={size} className={"text-warning"}/>
}
