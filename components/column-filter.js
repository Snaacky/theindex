import React from "react"


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
        console.log("Change:", event)
        this.onChange(this.filter)
    }

    renderColumn({_id, title, description, type, values}) {
        return {}
    }

    render() {
        return <>
            {this.columns.map(({_id, title, description, type, values}) =>
                <div className="col" key={_id}>

                </div>
            )}
        </>
    }
}