import {useState} from "react"

export default function Dropdown(
    {
        toggler,
        head,
        contentList
    }
) {
    const [show, setShow] = useState(false)

    return <li>
        <a className={"dropdown-toggle" + (show ? " show" : "")} role="button"
           aria-expanded={show.toString()} onClick={() => setShow(!show)}>
            {toggler}
        </a>
        <ul className={"collapse list-unstyled bg-4 " + (show ? " show" : "")}>
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
