export default function FormSwitch({_id, title, description, onChange}) {
    return <div>
        <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox"
                   aria-describedby={"switchFilterHelp-" + _id}
                   id={"switchFilter-" + _id}
                   onChange={(event) => {
                       onChange(event.target.value)
                   }}/>
            <label className="form-check-label"
                   htmlFor={"switchFilter-" + _id}>
                {title}
            </label>
        </div>
        <div id={"switchFilterHelp-" + _id} className="form-text">
            {description}
        </div>
    </div>
}
