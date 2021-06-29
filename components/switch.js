export default function FormSwitch({id, title, description, onChange}) {
    return <div>
        <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox"
                   aria-describedby={"switchFilterHelp-" + id}
                   id={"switchFilter-" + id}
                   onChange={(event) => {
                       onChange(event.target.value)
                   }}/>
            <label className="form-check-label"
                   htmlFor={"switchFilter-" + id}>
                {title}
            </label>
        </div>
        <div id={"switchFilterHelp-" + id} className="form-text">
            {description}
        </div>
    </div>
}