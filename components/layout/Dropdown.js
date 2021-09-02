import styles from "./Dropdown.module.css"
import {useEffect, useRef} from "react"

export default function Dropdown(
    {
        show = false,
        toggler,
        head,
        dropLeft = false,
        hideCavet = false,
        contentList,
        toggle
    }
) {
    const ref = useRef()

    useEffect(() => {
        const checkIfClickedOutside = e => {
            if (show) {
                // If dropdown is open and the clicked target is not within the menu,
                if (ref && ref.current && !ref.current.contains(e.target)) {
                    toggle(false)
                }
            }
        }
        document.addEventListener("mousedown", checkIfClickedOutside)

        return () => {
            // Cleanup
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    })

    return <li className={styles.dropdown + " nav-item dropdown"} ref={ref}>
        <a className={
            styles.toggler + (hideCavet ? " " + styles.cavet : "") + " nav-link dropdown-toggle" + (show ? " show" : "")
        } role="button" aria-expanded={show.toString()} onClick={() => toggle(!show)}>
            {toggler}
        </a>
        <ul className={"dropdown-menu bg-4 " + (dropLeft ? styles.left + " dropdown-menu-end" : styles.right) + (show ? " show" : "")}
            data-bs-popper={"none"}>
            {head ? <>
                <li onClick={() => toggle(false)}>
                    {head}
                </li>
                <li>
                    <hr className="dropdown-divider"/>
                </li>
            </> : <></>
            }
            {contentList.map((c, i) =>
                <li key={i} onClick={() => toggle(false)}>
                    {c}
                </li>
            )}
        </ul>
    </li>
}
