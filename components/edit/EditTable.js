import React from "react"
import Link from "next/link"
import ColumnRow from "../rows/ColumnRow"
import IconDoubleArrow from "../icons/IconDoubleArrow"

export default class EditTable extends React.Component {
    constructor({tables, columnsDatalist, _id, urlId, title, nsfw, description, columns}) {
        super({tables, columnsDatalist, _id, urlId, title, nsfw, description, columns})


        this.columnsDatalist = columnsDatalist.sort((a, b) => a.title > b.title ? 1 : -1)
        this.tablesDatalist = tables.map(t => t.title)
        this.urlDatalist = tables.map(t => t.urlId)

        const columnsNotSelected = columns ? this.columnsDatalist.filter(cDL => !columns.some(t => t._id === cDL._id))
            : this.columnsDatalist
        this.state = {
            _id,
            urlId: urlId || "",
            title: title || "",
            nsfw: nsfw || false,
            description: description || "",
            columns: columns || [],
            columnsNotSelected: columnsNotSelected
        }
    }

    saveTable() {
        if (this.state.title !== "" && this.state.urlId !== "") {
            if (this.state.urlId === "_new") {
                return alert("Illegal url id: '_new' is forbidden!")
            }

            let body = {
                urlId: this.state.urlId,
                title: this.state.title,
                nsfw: this.state.nsfw,
                description: this.state.description,
                columns: this.state.columns
            }
            if (this.state._id) {
                body._id = this.state._id
            }

            fetch("/api/edit/table", {
                method: "post",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }).then(r => {
                if (r.status !== 200) {
                    alert("Failed to save data: Error " + r.status)
                } else {
                    alert("Changes have been saved")
                    window.location.href = "/edit/tables"
                }
            })
        } else {
            alert("Wow, wow! Wait a minute bro, you forgot to fill in the title and url id")
        }
    }

    addColumn(column) {
        this.setState({
            columns: this.state.columns.concat([{
                _id: column._id,
                order: this.state.columns.length
            }]),
            columnsNotSelected: this.state.columnsNotSelected.filter(t => t._id !== column._id)
        })
    }

    moveColumn(column, sort) {
        let temp = this.state.columns.find(t => t._id === column._id)
        if (temp.order + sort < 0 || temp.order + sort === this.state.columns.length) {
            return
        }

        temp.order += sort
        let temp2 = this.state.columns[temp.order]
        temp2.order -= sort

        let copy = this.state.columns
        copy[temp.order] = temp
        copy[temp2.order] = temp2

        this.setState({
            columns: copy
        })
    }

    removeColumn(column) {
        let temp = this.state.columns.filter(t => t._id !== column._id)
        temp = temp.map((t, i) => {
            t.order = i
            return t
        })

        this.setState({
            columns: temp,
            columnsNotSelected: this.state.columnsNotSelected.concat([
                this.columnsDatalist.find(t_dl => t_dl._id === column._id)
            ]).sort((a, b) => a.title > b.title ? 1 : -1)
        })
    }

    render() {
        return <form>
            <div className={"row"}>
                <div className={"col-12 col-lg-6 mb-3"}>
                    <label htmlFor={"createTableInputTitle"} className={"form-label"}>
                        Title
                    </label>
                    <input type={"text"} className={"form-control"} id={"createTableInputTitle"}
                           value={this.state.title}
                           list={"createTableInputTitleDatalist"} aria-describedby={"createTableInputTitleHelp"}
                           placeholder={"Enter a title"} required={true}
                           onChange={(input) => {
                               this.setState({title: input.target.value})
                           }}/>
                    <datalist id={"createTableInputTitleDatalist"}>
                        {this.tablesDatalist.map(t => <option value={t} key={t}/>)}
                    </datalist>
                    <div id={"createTableInputTitleHelp"} className={"form-text"}>
                        Shown name of table
                    </div>
                </div>
                <div className={"col-12 col-lg-6 mb-3"}>
                    <label htmlFor={"createTableInputURL"} className={"form-label"}>
                        URL
                    </label>
                    <input type={"text"} className={"form-control"} id={"createTableInputURL"} value={this.state.urlId}
                           list={"createTableInputURLDatalist"} aria-describedby={"createTableInputURLHelp"}
                           placeholder={"Enter the url id"} required={true}
                           onChange={(input) => {
                               this.setState({urlId: input.target.value})
                           }}/>
                    <datalist id={"createTableInputURLDatalist"}>
                        {this.urlDatalist.map(t => <option value={t} key={t}/>)}
                    </datalist>
                    <div id={"createTableInputURLHelp"} className={"form-text"}>
                        Identifier used for the URLs, must be a string containing only <code>[a-zA-Z0-9]</code>
                    </div>
                </div>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="createTableInputNSFW" value={this.state.nsfw}
                       onChange={(input) => {
                           this.setState({nsfw: input.target.checked})
                       }}/>
                <label className="form-check-label" htmlFor="createTableInputNSFW">
                    NSFW: contains adult only content
                </label>
            </div>
            <div className="mb-3">
                <label htmlFor="createTableInputDescription" className="form-label">Description</label>
                <textarea className="form-control" id="createTableInputDescription" rows="3"
                          placeholder={"Enter a fitting description"} value={this.state.description}
                          onChange={(input) => {
                              this.setState({description: input.target.value})
                          }}/>
            </div>
            <label className="form-label">Columns</label>
            {this.state.columns.length === 0 ? <div>
                <kbd>No columns selected</kbd>
            </div> : <></>
            }
            {this.state.columns.map(t => <ColumnRow column={this.columnsDatalist.find(t_dl => t_dl._id === t._id)}
                                                    move={(sort) => this.moveColumn(t, sort)}
                                                    remove={() => this.removeColumn(t)} key={t._id}/>)}
            <hr/>
            <label className="form-label">Available columns</label>
            {this.state.columnsNotSelected.length === 0 ? <div>
                <kbd>No columns available</kbd>
            </div> : <></>
            }
            {this.state.columnsNotSelected.map(t => <ColumnRow column={t} key={t._id} add={() => this.addColumn(t)}/>)}

            <button className={"btn btn-primary"} type="button" onClick={() => this.saveTable()}>
                {typeof this.state._id === "undefined" ? "Create table" : "Save changes"}
            </button>
            <span className={"float-end"}>
                <Link href={"/edit/tables"}>
                    <a className={"btn btn-outline-secondary"}>
                        Table manager
                        <IconDoubleArrow/>
                    </a>
                </Link>
            </span>
        </form>
    }
}
