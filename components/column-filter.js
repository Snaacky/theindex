import React from "react"
import FormSwitch from "./form/switch"
import ArrayInput from "./form/array-input"


export default class ColumnFilter extends React.Component {
    constructor({columns, onChange}) {
        super({columns, onChange})

        if (!columns) {
            console.error("No columns definition provided for ColumnFilter", columns)
        }
        this.columns = columns
        this.filter = []

        if (typeof onChange !== "function") {
            console.error("No columns definition provided for ColumnFilter", onChange)
        }
        this.onChange = onChange
    }

    adjustFilter(event) {
        this.onChange(this.filter)
    }

    renderColumn({_id, title, description, type, values}) {
        if (type === "bool") {
            return <FormSwitch _id={_id} title={title} description={description}
                               onChange={(d) => {
                                   console.log("Changed!!!", d)
                                   this.adjustFilter(d)
                               }}/>
        } else if (type === "array") {
            const f = this.filter.find(f => f._id === _id)

            let tags = []
            if (typeof f !== "undefined") {
                tags = f.tags
            }

            return <>
                <ArrayInput _id={_id} title={title} description={description}
                            tags={tags} suggestions={values}
                            onChange={(d) => {
                                console.log("Changed!!!", d)
                                this.adjustFilter(d)
                            }}/>
            </>
        } else {
            return <div className={"card"}>
                <div className="card-body">
                    <h5 className="card-title">
                        {title}
                    </h5>
                    <p>
                        {description}
                    </p>
                </div>
            </div>
        }
    }

    render() {
        return <>
            {this.columns.map(({_id, title, description, type, values}) =>
                <div className="col" key={_id}>
                    {
                        this.renderColumn({
                            _id,
                            title,
                            description,
                            type,
                            values
                        })
                    }

                </div>
            )}
        </>
    }
}