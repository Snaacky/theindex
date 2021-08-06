import React from "react";
import TableRow from "../rows/TableRow";

export default class EditTab extends React.Component {
    constructor({tabs, tables_datalist, _id, urlId, title, nsfw, description, tables}) {
        super({tabs, tables_datalist, _id, urlId, title, nsfw, description, tables});


        this.tablesDatalist = tables_datalist.sort((a, b) => a.title > b.title)
        this.tabsDatalist = tabs.map(t => t.title)
        this.urlDatalist = tabs.map(t => t.urlId)

        const tablesNotSelected = tables ? this.tablesDatalist.filter(t_dl => !tables.some(t => t._id === t_dl._id))
            : this.tablesDatalist
        this.state = {
            _id,
            urlId: urlId || "",
            title: title || "",
            nsfw: nsfw || false,
            description: description || "",
            tables: tables || [],
            tablesNotSelected: tablesNotSelected
        }
    }

    saveTable() {
        console.log("Yippeahadkslad", this.state)
        if (this.state.title !== "" && this.state.urlId !== "") {
            if (this.state.urlId === "_new") {
                return alert("Illegal url id: '_new' is forbidden!")
            }

            let body = {
                urlId: this.state.urlId,
                title: this.state.title,
                nsfw: this.state.nsfw,
                description: this.state.description,
                tables: this.state.tables
            }
            if (this.state._id) {
                body._id = this.state._id
            }

            fetch("/api/edit/tab", {
                method: "post",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }).then(r => {
                if (r.status !== 200) {
                    alert("Failed to save data: Error " + r.status)
                } else {
                    alert("Changes have been saved")
                }
            })
        } else {
            alert("Wow, wow! Wait a minute bro, you forgot to fill in the title and url id")
        }
    }

    addTable(table) {
        this.setState({
            tables: this.state.tables.concat([{
                _id: table._id,
                order: this.state.tables.length
            }]),
            tablesNotSelected: this.state.tablesNotSelected.filter(t => t._id !== table._id)
        })
    }

    moveTable(table, sort) {
        let temp = this.state.tables.find(t => t._id === table._id)
        if (temp.order + sort < 0 || temp.order + sort === this.state.tables.length) {
            return
        }

        temp.order += sort
        let temp2 = this.state.tables[temp.order]
        temp2.order -= sort

        let copy = this.state.tables
        copy[temp.order] = temp
        copy[temp2.order] = temp2

        this.setState({
            tables: copy
        })
    }

    removeTable(table) {
        let temp = this.state.tables.filter(t => t._id !== table._id)
        temp = temp.map((t, i) => {
            t.order = i
            return t
        })

        this.setState({
            tables: temp,
            tablesNotSelected: this.state.tablesNotSelected.concat([
                this.tablesDatalist.find(t_dl => t_dl._id === table._id)
            ]).sort((a, b) => a.title > b.title)
        })
    }

    render() {
        return <form>
            <div className={"row"}>
                <div className={"col-12 col-lg-6 mb-3"}>
                    <label htmlFor={"createTabInputTitle"} className={"form-label"}>
                        Title
                    </label>
                    <input type={"text"} className={"form-control"} id={"createTabInputTitle"} value={this.state.title}
                           list={"createTabInputTitleDatalist"} aria-describedby={"createTabInputTitleHelp"}
                           placeholder={"Enter a title"} required={true}
                           onChange={(input) => {
                               this.setState({title: input.target.value})
                           }}/>
                    <datalist id={"createTabInputTitleDatalist"}>
                        {this.tabsDatalist.map(t => <option value={t} key={t}/>)}
                    </datalist>
                    <div id={"createTabInputTitleHelp"} className={"form-text"}>
                        Shown name of tab
                    </div>
                </div>
                <div className={"col-12 col-lg-6 mb-3"}>
                    <label htmlFor={"createTabInputURL"} className={"form-label"}>
                        URL
                    </label>
                    <input type={"text"} className={"form-control"} id={"createTabInputURL"} value={this.state.urlId}
                           list={"createTabInputURLDatalist"} aria-describedby={"createTabInputURLHelp"}
                           placeholder={"Enter the url id"} required={true}
                           onChange={(input) => {
                               this.setState({urlId: input.target.value})
                           }}/>
                    <datalist id={"createTabInputURLDatalist"}>
                        {this.urlDatalist.map(t => <option value={t} key={t}/>)}
                    </datalist>
                    <div id={"createTabInputURLHelp"} className={"form-text"}>
                        Identifier used for the URLs, must be a string containing only <code>[a-zA-Z0-9]</code>
                    </div>
                </div>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="createTabInputNSFW" value={this.state.nsfw}
                       onChange={(input) => {
                           this.setState({nsfw: input.target.checked})
                       }}/>
                <label className="form-check-label" htmlFor="createTabInputNSFW">
                    NSFW: contains adult only content
                </label>
            </div>
            <div className="mb-3">
                <label htmlFor="createTabInputDescription" className="form-label">Description</label>
                <textarea className="form-control" id="createTabInputDescription" rows="3"
                          placeholder={"Enter a fitting description"} value={this.state.description}
                          onChange={(input) => {
                              this.setState({description: input.target.value})
                          }}/>
            </div>
            <label className="form-label">Tables</label>
            {this.state.tables.length === 0 ? <div>
                No tables selected
            </div> : <></>
            }
            {this.state.tables.map(t => <TableRow table={this.tablesDatalist.find(t_dl => t_dl._id === t._id)}
                                                  move={(sort) => this.moveTable(t, sort)}
                                                  remove={() => this.removeTable(t)} key={t._id}/>)}
            <hr/>
            <label className="form-label">Table pool</label>
            {this.state.tablesNotSelected.length === 0 ? <div>
                No tables available
            </div> : <></>
            }
            {this.state.tablesNotSelected.map(t => <TableRow table={t} key={t._id} add={() => this.addTable(t)}/>)}

            <button className={"btn btn-primary"} type="button" onClick={() => this.saveTable()}>
                {typeof this.state._id === "undefined" ? "Create tab" : "Save changes"}
            </button>
        </form>
    }
}