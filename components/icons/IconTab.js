import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export default function IconItem({size}) {
    return <FontAwesomeIcon icon={["fas", "folder"]} size={size} className={"text-warning"}/>
}
