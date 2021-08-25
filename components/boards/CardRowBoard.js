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
import ColumnRow from "../rows/ColumnRow"
import TableCard from "../cards/TableCard"
import TableRow from "../rows/TableRow"
import TabRow from "../rows/TabRow"
import ColumnCard from "../cards/ColumnCard"
import TabCard from "../cards/TabCard"

export default class CardRowBoard extends React.Component {
    constructor(
        {
            _id,
            content,
            allContent,
            type, // item, column, table or tab
            updateContentURL = "",
            updateContentKey = "",
            deleteContentURL = "",
            columns = []
        }) {
        super({_id, content, allContent, columns})

        this.type = type
        this.updateContentURL = updateContentURL
        this.updateContentKey = updateContentKey
        this.deleteContentURL = deleteContentURL

        let unselectedContent = (allContent || []).filter(i => !content.some(ii => i._id === ii._id))
        if (!Array.isArray(unselectedContent)) {
            unselectedContent = []
        }

        this.state = {
            _id,
            content,
            unselectedContent,
            columns,
            useCards: true,
            compactView: false,
            editView: false,
            filter: []
        }
    }

    updateContent(content, unselectedContent) {
        let body = {
            _id: this.state._id
        }
        body[this.updateContentKey] = content.map(i => i._id)

        if (this.updateContentURL !== "" && this.updateContentKey !== "") {
            fetch(this.updateContentURL, {
                method: "post",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }).then(r => {
                if (r.status !== 200) {
                    alert("Failed to save data: Error " + r.status)
                } else {
                    this.setState({
                        content,
                        unselectedContent
                    })
                }
            })
        } else {
            console.warn("No updateContentURL or updateContentKey provided")
        }
    }

    removeContent(content) {
        const newContent = this.state.content.filter(i => i._id !== content._id)
        if (this.deleteContentURL !== "") {
            if (confirm("Do you really want to delete the " + this.type + " '" + content.title + "'?")) {
                fetch(this.deleteContentURL, {
                    method: "post",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({_id: content._id})
                }).then(r => {
                    if (r.status !== 200) {
                        alert("Failed to save data: Error " + r.status)
                    } else {
                        this.setState({
                            content
                        })
                    }
                })
            }
        } else {
            const newUnselectedContent = this.state.unselectedContent.concat([content])
            this.updateContent(newContent, newUnselectedContent)
        }
    }

    addContent(content) {
        const newContent = this.state.content.concat([content])
        const newUnselectedContent = this.state.unselectedContent.filter(i => i._id !== content._id)
        this.updateContent(newContent, newUnselectedContent)
    }

    moveContent(content, move) {
        const currentPosition = this.state.content.findIndex(c => c._id === content._id)
        if (!(currentPosition === 0 && move < 0 || currentPosition === this.state.content.length && move > 0)) {
            console.log("Moved content", content, move)
            const temp = this.state.content[currentPosition]
            const temp2 = this.state.content[currentPosition + move]

            let copy = this.state.content
            copy[currentPosition] = temp2
            copy[currentPosition + move] = temp
            this.updateContent(copy, this.state.unselectedContent)
        }
    }

    renderSingleContent(content, canMove = false, canAdd = false, canRemove = false) {
        if (this.type === "item") {
            if (this.state.useCards) {
                return <ItemCard item={content} columns={this.state.compactView ? [] : this.state.columns}
                                 remove={canRemove ? () => this.removeContent(content) : null}
                                 add={canAdd ? () => this.addContent(content) : null}/>
            }
            return <ItemRow item={content} columns={this.state.compactView ? [] : this.state.columns}
                            remove={canRemove ? () => this.removeContent(content) : null}
                            add={canAdd ? () => this.addContent(content) : null}/>
        } else if (this.type === "column") {
            if (this.state.useCards) {
                return <ColumnCard column={content} add={canAdd ? () => this.addContent(content) : null}
                                   remove={canRemove ? () => this.removeContent(content) : null}
                                   move={canMove ? (m) => this.moveContent(content, m) : null}/>
            }
            return <ColumnRow column={content} remove={canRemove ? () => this.removeContent(content) : null}
                              add={canAdd ? () => this.addContent(content) : null}
                              move={canMove ? (m) => this.moveContent(content, m) : null}/>
        } else if (this.type === "table") {
            if (this.state.useCards) {
                return <TableCard table={content} add={canAdd ? () => this.addContent(content) : null}
                                  remove={canRemove ? () => this.removeContent(content) : null}
                                  move={canMove ? (m) => this.moveContent(content, m) : null}/>
            }
            return <TableRow table={content} remove={canRemove ? () => this.removeContent(content) : null}
                             add={canAdd ? () => this.addContent(content) : null}
                             move={canMove ? (m) => this.moveContent(content, m) : null}/>
        } else if (this.type === "tab") {
            if (this.state.useCards) {
                return <TabCard tab={content} add={canAdd ? () => this.addContent(content) : null}
                                remove={canRemove ? () => this.removeContent(content) : null}
                                move={canMove ? (m) => this.moveContent(content, m) : null}/>
            }
            return <TabRow tab={content} remove={canRemove ? () => this.removeContent(content) : null}
                           add={canAdd ? () => this.addContent(content) : null}
                           move={canMove ? (m) => this.moveContent(content, m) : null}/>
        } else {
            console.error("Unknown type of content:", this.type)
        }
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
                    {this.state.columns.length > 0 ?
                        <button className={"btn btn-outline-secondary me-2"} type={"button"}
                                onClick={() => this.setState({compactView: !this.state.compactView})}>
                            <FontAwesomeIcon icon={["fas", (this.state.compactView ? "expand" : "compress")]}
                                             className={"me-2"}/>
                            {this.state.compactView ? "More details" : "Less details"}
                        </button> : <></>}
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
                {this.state.content.length === 0 ? <span className={"text-muted"}>
                    Nothing could be found
                </span> : <></>}
                {this.state.content.map(i => this.renderSingleContent(
                    i,
                    this.state.editView && this.deleteContentURL === "",
                    false,
                    this.state.editView
                ))}
            </div>
            {this.state.editView ? <>
                <hr/>
                <div className={"d-flex flex-wrap"}>
                    {this.state.unselectedContent.length === 0 ?
                        <span className={"text-muted"}>
                            There is nothing to be added anymore
                        </span> : <></>}
                    {this.state.unselectedContent.map(i => this.renderSingleContent(i, false, true))}
                    <Link href={"/edit/" + this.type + "/_new"}>
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
                {editView ? "Exit" : <IconEdit/>} edit-mode
            </button>
        </div>
    }
    return <></>
}
