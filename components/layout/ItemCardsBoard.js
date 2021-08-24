import React from "react"
import ItemCard from "../cards/ItemCard"
import ItemRow from "../rows/ItemRow";
import ColumnFilter from "../column-filter"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export default class ItemCardsBoard extends React.Component {
    constructor({_id, items, columns}) {
        super({_id, items, columns})

        this.state = {
            _id,
            items,
            columns,
            useCards: true,
            filter: []
        }
    }

    updateItems(items) {
        let body = {
            _id: this.state._id,
            items
        }

        fetch("/api/edit/table/items", {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        }).then(r => {
            if (r.status !== 200) {
                alert("Failed to save data: Error " + r.status)
            } else {
                alert("Changes have been saved")
                this.setState({
                    items
                })
            }
        })
    }

    removeItemFromTable(item) {
        this.updateItems(this.state.items.filter(i => i._id !== item._id))
    }

    addItemToTable(item) {
        this.updateItems(this.state.items.concat([item._id]))
    }

    render() {
        return <>
            <div className={"card card-body bg-2 mb-2"}>
                <div>
                    <button className={"btn btn-outline-primary"} type={"button"}
                            data-bs-toggle={"collapse"} data-bs-target={"#collapseFilter"}
                            aria-expanded="false" aria-controls={"collapseFilter"}>
                        <FontAwesomeIcon icon={["fas", "filter"]}/> Filter
                    </button>
                    <button className={"btn btn-outline-secondary mx-2"} type={"button"}
                            onClick={() => this.setState({useCards: !this.state.useCards})}>
                        <FontAwesomeIcon icon={["fas", (this.state.useCards ? "th-list" : "th-large")]}
                                         className={"me-2"}/>
                        {this.state.useCards ? "List" : "Grid"}
                    </button>
                </div>
                <div id={"collapseFilter"} className="collapse row g-3">
                    <ColumnFilter columns={this.state.columns} onChange={console.log}/>
                    <span className={"text-muted"}>
                        This is a placeholder text
                    </span>
                </div>
            </div>
            <div className={"d-flex flex-wrap"}>
                {this.state.items.length === 0 ? <span className={"text-muted"}>No items found</span> : <></>}
                {this.state.items.map(i => {
                    if (this.state.useCards) {
                        return <ItemCard item={i} columns={this.state.columns}
                                         remove={() => this.removeItemFromTable(i)} key={i._id}/>
                    }
                    return <ItemRow item={i} columns={this.state.columns} remove={() => this.removeItemFromTable(i)}
                                    key={i._id}/>
                })}
            </div>
        </>
    }
}