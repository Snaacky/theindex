export default function NoScriptAlert() {
    return <div className={"alert alert-danger"} role={"alert"}>
        <h4 className="alert-heading">
            JavaScript is disabled
        </h4>
        <span>
            This site relies on JavaScript, some features may not be fully functional with JavaScript
            turned off.
        </span>
        <hr/>
        <span>
            Here are the <a className={"alert-link"} href="https://www.enable-javascript.com/">
                instructions how to enable JavaScript in your web browser
            </a>.
        </span>
    </div>
}
