import React from "react"
import Link from "next/link"
import styles from "../rows/TableRow.module.css"
import IconDelete from "../icons/IconDelete"
import IconAdd from "../icons/IconAdd"
import IconDoubleArrow from "../icons/IconDoubleArrow"
import DataCard from "../cards/DataCard";

export default class EditItem extends React.Component {
    constructor({_id, title, urls, nsfw, description, data, blacklist, columns}) {
        super({_id, title, urls, nsfw, description, data, blacklist, columns})

        this.columns = columns.sort((a, b) => a.title < b.title ? -1 : 1)

        this.state = {
            _id,
            title: title || "",
            urls: urls || [],
            nsfw: nsfw || false,
            description: description || "",
            data: data || {},
            blacklist: blacklist || false,
            newURL: ""
        }
    }

    saveItem() {
        if (this.state.title !== "") {
            let body = {
                title: this.state.title,
                urls: this.state.urls,
                nsfw: this.state.nsfw,
                description: this.state.description,
                data: this.state.data,
                blacklist: this.state.blacklist
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
                    window.location.href = "/edit/items"
                }
            })
        } else {
            alert("Wow, wow! Wait a minute bro, you forgot to fill in the title")
        }
    }

    addURL() {
        if (this.state.newURL !== "") {
            this.setState({
                urls: this.state.urls.concat([this.state.newURL]),
                newURL: ""
            })
        }
    }

    updateURLs(i, newURL) {
        let temp = this.state.urls
        temp[i] = newURL
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
        console.log("Updating column:", column, "with data value:", value)

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
                    <label htmlFor={"createItemInputTitle"} className={"form-label"}>
                        Title
                    </label>
                    <input type={"text"} className={"form-control"} id={"createItemInputTitle"}
                           value={this.state.title} aria-describedby={"createItemInputTitleHelp"}
                           placeholder={"Enter a title"} required={true}
                           onChange={(input) => {
                               this.setState({title: input.target.value})
                           }}/>
                    <div id={"createItemInputTitleHelp"} className={"form-text"}>
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
                                   this.setState({nsfw: input.target.checked})
                               }} value={this.state.blacklist}/>
                        <label className="form-check-label" htmlFor="createItemInputBlacklist">
                            <span className={"text-danger"}>
                                Blacklist
                            </span> item to <span className={"text-danger"}>
                                hide
                            </span> it from being publicly visible
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
                {this.state.urls.map((v, i) =>
                    <div className={"row mb-2"} key={i}>
                        <div className={"col pe-0"}>
                            <input type={"text"} className={"form-control"} id={"itemValueInput-" + i} value={v}
                                   placeholder={"Enter a valid url"} required={true}
                                   onChange={(input) => {
                                       this.updateURLs(i, input.target.value)
                                   }}/>
                        </div>
                        <div className={styles.column + " col-auto px-1"}>
                            <a onClick={() => this.removeURL(i)} title={"Remove url"} className={"float-end"}
                               style={{
                                   width: "38px",
                                   height: "38px"
                               }}>
                                <IconDelete/>
                            </a>
                        </div>
                    </div>)}
                {this.state.urls.length > 0 ? <hr/> : <></>}
                <div className={"row"}>
                    <div className={"col pe-0"}>
                        <input type={"text"} className={"form-control"} id={"itemValueInput-new"}
                               value={this.state.newURL} placeholder={"Enter a valid url"}
                               onChange={(input) => {
                                   this.setState({
                                       newURL: input.target.value
                                   })
                               }}/>
                    </div>
                    <div className={styles.column + " col-auto px-1"}>
                        <a onClick={() => this.addURL()} title={"Add url"}
                           className={"float-end"} style={{
                            width: "38px",
                            height: "38px"
                        }}>
                            <IconAdd/>
                        </a>
                    </div>
                </div>
            </div>

            <hr/>
            <label className="form-label">
                Columns
            </label>
            <div className={"d-flex mb-3"}>
                {this.columns.map(c => <div key={c._id}>
                    <DataCard data={this.state.data[c._id]} column={c} onChange={(v) => this.dataUpdate(c, v)}/>
                </div>)}
            </div>

            <button className={"btn btn-primary"} type="button" onClick={() => this.saveItem()}>
                {typeof this.state._id === "undefined" ? "Create item" : "Save changes"}
            </button>
            <span className={"float-end"}>
                <Link href={"/edit/items"}>
                    <a className={"btn btn-outline-secondary"}>
                        Item manager
                        <IconDoubleArrow/>
                    </a>
                </Link>
            </span>
        </form>
    }
}
