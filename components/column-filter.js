import React from "react";
import FormSwitch from "./switch";
import ArrayInput from "./array-input";


export default class ColumnFilter extends React.Component {
    constructor({columns, onChange}) {
        super(undefined);

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

    renderColumn({id, title, description, type, values}) {
        if (type === "bool") {
            return <FormSwitch id={id} title={title} description={description}
                               onChange={(d) => {
                                   console.log("Changed!!!", d)
                                   this.adjustFilter(d)
                               }}/>
        } else if (type === "array") {
            const f = this.filter.find(f => f.id === id)

            let tags = []
            if (typeof f !== "undefined") {
                tags = f.tags
            }

            return <>
                <ArrayInput id={id} title={title} description={description}
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
                        <Link href={"/table/" + id}>
                            {title}
                        </Link>
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
            {this.columns.map(({id, title, description, type, values}) =>
                <div className="col" key={id}>
                    {
                        this.renderColumn({
                            id,
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