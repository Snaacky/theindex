import {useState} from "react"
import Link from "next/link"
import styles from "./NavbarDropdown.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export default function NavbarDropdown(
    {
        targetId,
        toggler,
        contentList,
        viewAllUrl,
        onClick
    }
) {
    const [show, setShow] = useState(false)

    return <li className={"nav-item"}>
        <a className={styles.toggle + " collapsed nav-link" + (show ? " show" : "")} role="button"
           data-bs-toggle={"collapse"} data-bs-target={"#" + targetId} aria-expanded={show.toString()}
           onClick={() => setShow(!show)}>
            <div className={styles.chevron}>
                <FontAwesomeIcon icon={["fas", show ? "chevron-down" : "chevron-right"]}/>
            </div>
            {toggler}
        </a>

        <div id={targetId} className={"collapse" + (show ? " show" : "")}>
            <ul className={"list-unstyled rounded bg-3 ms-4"}>
                {contentList.map((c, i) =>
                    <li className={"nav-item"} onClick={onClick} key={i}>
                        {c}
                    </li>
                )}
                {viewAllUrl ? <>
                    <hr className={"dropdown-divider"}/>
                    <li className={"nav-item"} onClick={onClick}>
                        <Link href={viewAllUrl}>
                            <a className={"nav-link small text-end"}>
                                View all
                            </a>
                        </Link>
                    </li>
                </> : <></>
                }
            </ul>
        </div>
    </li>
}
