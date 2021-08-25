import React from "react"
import Link from "next/link"
import ColumnRow from "../rows/ColumnRow"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export default class EditTable extends React.Component {
    constructor({tables, _id, urlId, title, nsfw, description}) {
        super({tables, _id, urlId, title, nsfw, description})

        this.tablesDatalist = tables.map(t => t.title)
        this.urlDatalist = tables.map(t => t.urlId)

        this.state = {
            _id,
            urlId: urlId || "",
            title: title || "",
            nsfw: nsfw || false,
            description: description || ""
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
                description: this.state.description
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

            <button className={"btn btn-primary"} type="button" onClick={() => this.saveTable()}>
                <FontAwesomeIcon icon={["fas", "save"]} className={"me-2"}/>
                {typeof this.state._id === "undefined" ? "Create table" : "Save changes"}
            </button>
            <span className={"float-end"}>
                <Link href={"/edit/tables"}>
                    <a className={"btn btn-outline-secondary"}>
                        Table manager
                        <FontAwesomeIcon icon={["fas", "arrow-alt-circle-right"]} className={"ms-2"}/>
                    </a>
                </Link>
            </span>
        </form>
    }
}
