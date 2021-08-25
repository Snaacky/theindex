import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export default function IconNewTabLink({url, size}) {
    if (url && url !== "") {
        return <a className={"ms-2"} target={"_blank"} href={url} rel="noreferrer" title={"Open in new tab"}>
            <FontAwesomeIcon icon={["fas", "external-link-alt"]} size={size}/>
        </a>
    }
    return <span title={"Missing url"}>
        <FontAwesomeIcon icon={["fas", "external-link-alt"]} size={size} className={"ms-2 text-danger"}/>
    </span>
}
