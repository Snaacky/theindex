import React from "react"
import Link from "next/link"
import {useSession} from "next-auth/client"
import ItemCard from "../cards/ItemCard"
import ItemRow from "../rows/ItemRow"
import ColumnFilter from "../column-filter"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {canEdit} from "../../lib/session"
import IconEdit from "../icons/IconEdit"
import IconAdd from "../icons/IconAdd"

export default class ItemCardsBoard extends React.Component {
    constructor({_id, items, allItems, columns}) {
        super({_id, items, allItems, columns})

        let notSelectedItems = (allItems || []).filter(i => !items.some(ii => i._id === ii._id))
        if (!Array.isArray(notSelectedItems)) {
            notSelectedItems = []
        }

        this.state = {
            _id,
            items,
            columns,
            notSelectedItems,
            useCards: true,
            compactView: false,
            editView: false,
            filter: []
        }
    }

    updateItems(items, notSelectedItems) {
        let body = {
            _id: this.state._id,
            items: items.map(i => i._id)
        }

        fetch("/api/edit/table/items", {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        }).then(r => {
            if (r.status !== 200) {
                alert("Failed to save data: Error " + r.status)
            } else {
                this.setState({
                    items,
                    notSelectedItems
                })
            }
        })
    }

    removeItemFromTable(item) {
        this.updateItems(this.state.items.filter(i => i._id !== item._id), this.state.notSelectedItems.concat([item]))
    }

    addItemToTable(item) {
        this.updateItems(this.state.items.concat([item]), this.state.notSelectedItems.filter(i => i._id !== item._id))
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
                    <button className={"btn btn-outline-secondary me-2"} type={"button"}
                            onClick={() => this.setState({compactView: !this.state.compactView})}>
                        <FontAwesomeIcon icon={["fas", (this.state.compactView ? "expand" : "compress")]}
                                         className={"me-2"}/>
                        {this.state.compactView ? "More details" : "Less details"}
                    </button>
                    <EditButton onClick={() => this.setState({editView: !this.state.editView})}
                                editView={this.state.editView}/>
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
                        return <ItemCard item={i} columns={this.state.compactView ? [] : this.state.columns}
                                         remove={this.state.editView ? () => this.removeItemFromTable(i) : null}
                                         key={i._id}/>
                    }
                    return <ItemRow item={i} columns={this.state.compactView ? [] : this.state.columns} key={i._id}
                                    remove={this.state.editView ? () => this.removeItemFromTable(i) : null}/>
                })}
            </div>
            {this.state.editView ? <>
                <hr/>
                <div className={"d-flex flex-wrap"}>
                    {this.state.notSelectedItems.length === 0 ?
                        <span className={"text-muted"}>All existing items already added</span> : <></>}
                    {this.state.notSelectedItems.map(i => {
                        if (this.state.useCards) {
                            return <ItemCard item={i} columns={this.state.compactView ? [] : this.state.columns}
                                             add={() => this.addItemToTable(i)}/>
                        }
                        return <ItemRow item={i} columns={this.state.compactView ? [] : this.state.columns}
                                        add={() => this.addItemToTable(i)} remove={() => this.removeItemFromTable(i)}
                                        key={i._id}/>
                    })}
                    <Link href={"/edit/item/_new"}>
                        <a className={"btn btn-outline-success mx-2 mb-2 p-0"}
                           style={{width: "2.5rem", height: "2.5rem"}}>
                            <IconAdd/>
                        </a>
                    </Link>
                </div>
            </> : <></>}
        </>
    }
}

function EditButton({onClick, editView}) {
    const [session] = useSession()
    if (canEdit(session)) {
        return <div className={"float-end"}>
            <button className={"btn btn-outline-warning"} type={"button"} onClick={onClick}>
                {editView ? "Exit" : <><IconEdit/> Item</>} edit-mode
            </button>
        </div>
    }
    return <></>
}
