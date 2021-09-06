import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {isValidUrl} from "../../lib/utils"

export default function IconNewTabLink({url, size}) {
    if (isValidUrl(url)) {
        return <a className={"ms-2"} target={"_blank"} href={url} rel="noreferrer" title={"Open in new tab"}>
            <FontAwesomeIcon icon={["fas", "external-link-alt"]} size={size}/>
        </a>
    }

    return <span title={url && url !== "" ? "Invalid url" : "Missing url"}>
        <FontAwesomeIcon icon={["fas", "external-link-alt"]} size={size} className={"ms-2 text-danger"}/>
    </span>
}
