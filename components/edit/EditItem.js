import React from "react"
import styles from "../rows/Row.module.css"
import IconDelete from "../icons/IconDelete"
import DataCard from "../cards/DataCard"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import IconNewTabLink from "../icons/IconNewTabLink"
import {isValidUrl} from "../../lib/utils"

export default class EditItem extends React.Component {
    constructor({_id, name, urls, nsfw, description, data, blacklist, sponsor, columns}) {
        super({_id, name, urls, nsfw, description, data, blacklist, sponsor, columns})

        this.columns = columns.sort((a, b) => a.name < b.name ? -1 : 1)

        // a single empty url for inputting a real url, empty strings will be ignored in the save function
        if (urls && urls.length === 0 || !urls) {
            urls = [""]
        } else if (urls) {
            urls.push("")
        }

        this.state = {
            _id,
            name: name || "",
            urls: urls,
            nsfw: nsfw || false,
            description: description || "",
            data: data || {},
            blacklist: blacklist || false,
            sponsor: sponsor || false
        }
    }

    saveItem() {
        if (this.state.name !== "") {
            let body = {
                name: this.state.name,
                urls: this.state.urls.filter(u => u !== ""),
                nsfw: this.state.nsfw,
                description: this.state.description,
                data: this.state.data,
                blacklist: this.state.blacklist,
                sponsor: this.state.sponsor
            }
            if (this.state._id) {
                body._id = this.state._id
            }

            fetch("/api/edit/item", {
                method: "post",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }).then(r => {
                if (r.status !== 200) {
                    alert("Failed to save data: Error " + r.status)
                } else {
                    alert("Changes have been saved")
                    if (typeof this.state._id === "undefined") {
                        window.location.href = escape("/items")
                    }
                }
            })
        } else {
            alert("Wow, wow! Wait a minute bro, you forgot to fill in the name")
        }
    }

    updateURLs(i, newURL) {
        let temp = this.state.urls
        temp[i] = newURL
        if (temp[temp.length - 1] !== "") {
            temp.push("")
        } else if (temp.length > 1 && temp[temp.length - 2] === "") {
            temp.pop()
        }

        this.setState({
            urls: temp
        })
    }

    removeURL(i) {
        const temp = this.state.urls.splice(i, 1)
        this.setState({
            urls: temp
        })
    }

    dataUpdate(column, value) {
        let temp = this.state.data
        if (value === null && typeof this.state.data[column._id] !== "undefined") {
            console.log("Deleting", column._id)
            delete this.state.data[column._id]
            this.setState({
                data: temp
            })
        }

        if (column.type === "bool" && typeof value === "boolean" ||
            column.type === "array" && Array.isArray(value) ||
            column.type === "text" && typeof value === "string") {
            temp[column._id] = value
            this.setState({
                data: temp
            })
        }
    }

    render() {
        return <form>
            <div className={"row"}>
                <div className={"col-12 col-lg-6 mb-3"}>
                    <label htmlFor={"createItemInputName"} className={"form-label"}>
                        Name
                    </label>
                    <input type={"text"} className={"form-control"} id={"createItemInputName"}
                           value={this.state.name} aria-describedby={"createItemInputNameHelp"}
                           placeholder={"Enter a name"} required={true}
                           onChange={(input) => {
                               this.setState({name: input.target.value})
                           }}/>
                    <div id={"createItemInputNameHelp"} className={"form-text"}>
                        Shown name of item
                    </div>
                </div>
                <div className={"col-12 col-lg-6"}>
                    <div className={"form-check mb-3"}>
                        <input type="checkbox" className="form-check-input" id="createItemInputNSFW"
                               onChange={(input) => {
                                   this.setState({nsfw: input.target.checked})
                               }} value={this.state.nsfw}/>
                        <label className="form-check-label" htmlFor="createItemInputNSFW">
                            NSFW: contains adult only content
                        </label>
                    </div>
                    <div className={"form-check mb-3"}>
                        <input type="checkbox" className="form-check-input" id="createItemInputBlacklist"
                               onChange={(input) => {
                                   this.setState({blacklist: input.target.checked})
                               }} value={this.state.blacklist}/>
                        <label className="form-check-label" htmlFor="createItemInputBlacklist">
                            <span className={"text-danger"}>
                                Blacklist
                            </span> item to <span className={"text-danger"}>
                                hide
                            </span> it from being publicly visible
                        </label>
                    </div>
                    <div className={"form-check mb-3"}>
                        <input type="checkbox" className="form-check-input" id="createItemInputSponsored"
                               onChange={(input) => {
                                   this.setState({sponsor: input.target.checked})
                               }} value={this.state.sponsor}/>
                        <label className="form-check-label" htmlFor="createItemInputSponsored">
                            <span className={"text-warning"}>
                                Sponsored
                            </span> item
                        </label>
                    </div>
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="createItemInputDescription" className="form-label">Description</label>
                <textarea className="form-control" id="createItemInputDescription" rows="3"
                          placeholder={"Enter a fitting description"} value={this.state.description}
                          onChange={(input) => {
                              this.setState({description: input.target.value})
                          }}/>
            </div>

            <hr/>
            <label className="form-label">
                URLs
            </label>
            <div className={"mb-3"}>
                {this.state.urls.map(
                    (v, i) => {
                        const isValid = isValidUrl(v)
                        const className = v === "" ? "" : " is-" + (isValid ? "" : "in") + "valid"

                        return <div className={"mb-2"} key={i}>
                            <div className={"row"}>
                                <div className={"col pe-0"}>
                                    <input type={"text"} className={"form-control" + className}
                                           id={"itemValueInput-" + i} value={v} placeholder={"Enter a valid url"}
                                           required={true}
                                           onChange={(input) => {
                                               this.updateURLs(i, input.target.value)
                                           }}/>
                                </div>
                                <div className={styles.column + " col-auto px-1"}>
                                    {i < this.state.urls.length - 1 ?
                                        <div className={"d-flex flex-row"}>
                                            <span className={"me-2"} style={{fontSize: "1.5rem"}}>
                                                <IconNewTabLink url={v}/>
                                            </span>
                                            <a onClick={() => this.removeURL(i)} title={"Remove url"}
                                               style={{
                                                   width: "38px",
                                                   height: "38px"
                                               }}>
                                                <IconDelete/>
                                            </a>
                                        </div> :
                                        <span className={"text-muted ms-2"}>
                                            Empty url
                                        </span>
                                    }
                                </div>
                            </div>
                            {isValid || v === "" ? <></> : <div className={"invalid-feedback d-block"}>
                                This does not look like a valid url...
                            </div>}
                        </div>
                    }
                )}
                <div id={"createItemURLNameHelp"} className={"form-text"}>
                    Official web-page url, the first listed url will be used to route users. Empty fields will be
                    ignored and discarded
                </div>
            </div>

            <hr/>
            <label className="form-label">
                Columns
            </label>
            <div className={"d-flex flex-wrap mb-3"}>
                {this.columns.map(c => <div key={c._id}>
                    <DataCard data={this.state.data[c._id]} column={c} onChange={(v) => this.dataUpdate(c, v)}/>
                </div>)}
            </div>

            <span className={"float-end"}>
                <button className={"btn btn-primary mb-2 me-2"} type="button" onClick={() => this.saveItem()}>
                    <FontAwesomeIcon icon={["fas", "save"]} className={"me-2"}/>
                    {typeof this.state._id === "undefined" ? "Create item" : "Save changes"}
                </button>
            </span>
        </form>
    }
}
