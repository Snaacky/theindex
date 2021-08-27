import styles from "./Dropdown.module.css"

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
    // Hack to set unique ids of dropdowns
    const randString = Math.random().toString(36).slice(2)

    return <li className={styles.dropdown + " nav-item dropdown"}>
        <a className={
            styles.toggler + (hideCavet ? " " + styles.cavet : "") + " nav-link dropdown-toggle" + (show ? " show" : "")
        } role="button" id={"navDropdown-" + randString}
           aria-expanded={show.toString()} onClick={() => toggle(!show)}>
            {toggler}
        </a>
        <ul className={"dropdown-menu bg-4" + (show ? " show" : "") + (dropLeft ? " dropdown-menu-end" : "")}
            aria-labelledby={"navDropdown-" + randString} data-bs-popper={"none"}>
            {head ? <>
                <li>
                    {head}
                </li>
                <li>
                    <hr className="dropdown-divider"/>
                </li>
            </> : <></>
            }
            {contentList.map((c, i) =>
                <li key={i}>
                    {c}
                </li>
            )}
        </ul>
    </li>
}
