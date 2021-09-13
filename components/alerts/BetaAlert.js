import {useState} from "react"

export default function BetaAlert() {
    const [show, setShow] = useState(true)
    if (show) {
        return <div className={"alert alert-dark alert-dismissible show"} role={"alert"}>
            You are viewing a beta-site. Some features may not be fully functional and contain bugs.
            <a href={"https://piracy.moe"}>Click here</a> to go back to the old index.
            <button type="button" className="btn-close" aria-label="Close" onClick={() => setShow(false)}/>
        </div>
    }

    return <></>
}
