import React from "react"
import Link from "next/link"
import ItemCard from "../cards/ItemCard"
import ItemRow from "../rows/ItemRow"
import ColumnFilter from "../column-filter"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import ColumnRow from "../rows/ColumnRow"
import CollectionCard from "../cards/CollectionCard"
import CollectionRow from "../rows/CollectionRow"
import LibraryRow from "../rows/LibraryRow"
import ColumnCard from "../cards/ColumnCard"
import LibraryCard from "../cards/LibraryCard"
import UserCard from "../cards/UserCard"
import UserRow from "../rows/UserRow"
import ListCard from "../cards/ListCard"
import ListRow from "../rows/ListRow"

export default class Board extends React.Component {
    constructor(
        {
            _id,
            content,
            allContent,
            type, // item, column, collection or tab
            updateContentURL = "",
            updateContentKey = "",
            deleteContentURL = "",
            columns = [],
            forceEditMode = false,
            canMove = true,
            canEdit = false
        }) {
        super({_id, content, allContent, columns})

        this.type = type
        this.forceEditMode = forceEditMode
        this.canMove = canMove
        this.canEdit = canEdit
        this.updateContentURL = updateContentURL
        this.updateContentKey = updateContentKey
        this.deleteContentURL = deleteContentURL

        let unselectedContent = (allContent || []).filter(i => !content.some(ii => i._id === ii._id)) || []

        this.state = {
            _id,
            content,
            unselectedContent,
            columns,
            useCards: true,
            compactView: false,
            editView: forceEditMode,
            filter: [],
            filterExpanded: false,
            searchString: ""
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.allContent !== this.props.allContent || prevProps.content !== this.props.content) {
            this.setState({
                unselectedContent: (this.props.allContent || []).filter(i =>
                    !this.props.content.some(ii => i._id === ii._id)) || [],
                content: this.props.content
            })
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
            if (confirm("Do you really want to delete the " + this.type + " '" + content.name + "'?")) {
                fetch(this.deleteContentURL, {
                    method: "post",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({_id: content._id})
                }).then(r => {
                    if (r.status !== 200) {
                        alert("Failed to save data: Error " + r.status)
                    } else {
                        this.setState({
                            content: newContent
                        })
                    }
                })
            }
        } else {
            let newUnselectedContent = this.state.unselectedContent.concat([content])
            if (this.canMove) {
                newUnselectedContent = newUnselectedContent.sort((a, b) => a.name < b.name ? -1 : 1)
            }
            this.updateContent(newContent, newUnselectedContent)
        }
    }

    addContent(content) {
        let newContent = this.state.content.concat([content])
        if (this.canMove) {
            newContent = newContent.sort((a, b) => a.name < b.name ? -1 : 1)
        }

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
        const key = (content._id ?? content.uid) + "-" + (canMove ? "move" : "") +
            "-" + (canAdd ? "add" : "") +
            "-" + (canRemove ? "remove" : "")
        if (this.type === "item") {
            if (this.state.useCards) {
                return <ItemCard item={content} columns={this.state.compactView ? [] : this.state.columns}
                                 remove={canRemove ? () => this.removeContent(content) : null}
                                 add={canAdd ? () => this.addContent(content) : null}
                                 move={canMove ? (m) => this.moveContent(content, m) : null}
                                 key={key}/>
            }
            return <ItemRow item={content} columns={this.state.compactView ? [] : this.state.columns}
                            remove={canRemove ? () => this.removeContent(content) : null}
                            add={canAdd ? () => this.addContent(content) : null}
                            move={canMove ? (m) => this.moveContent(content, m) : null}
                            key={key}/>
        } else if (this.type === "column") {
            if (this.state.useCards) {
                return <ColumnCard column={content} add={canAdd ? () => this.addContent(content) : null}
                                   remove={canRemove ? () => this.removeContent(content) : null}
                                   move={canMove ? (m) => this.moveContent(content, m) : null}
                                   key={key}/>
            }
            return <ColumnRow column={content} remove={canRemove ? () => this.removeContent(content) : null}
                              add={canAdd ? () => this.addContent(content) : null}
                              move={canMove ? (m) => this.moveContent(content, m) : null}
                              key={key}/>
        } else if (this.type === "collection") {
            if (this.state.useCards) {
                return <CollectionCard collection={content} add={canAdd ? () => this.addContent(content) : null}
                                       remove={canRemove ? () => this.removeContent(content) : null}
                                       move={canMove ? (m) => this.moveContent(content, m) : null}
                                       key={key}/>
            }
            return <CollectionRow collection={content} remove={canRemove ? () => this.removeContent(content) : null}
                                  add={canAdd ? () => this.addContent(content) : null}
                                  move={canMove ? (m) => this.moveContent(content, m) : null}
                                  key={key}/>
        } else if (this.type === "library") {
            if (this.state.useCards) {
                return <LibraryCard tab={content} add={canAdd ? () => this.addContent(content) : null}
                                    remove={canRemove ? () => this.removeContent(content) : null}
                                    move={canMove ? (m) => this.moveContent(content, m) : null}
                                    key={key}/>
            }
            return <LibraryRow tab={content} remove={canRemove ? () => this.removeContent(content) : null}
                               add={canAdd ? () => this.addContent(content) : null}
                               move={canMove ? (m) => this.moveContent(content, m) : null}
                               key={key}/>
        } else if (this.type === "user") {
            if (this.state.useCards) {
                return <UserCard user={content} add={canAdd ? () => this.addContent(content) : null}
                                 remove={canRemove ? () => this.removeContent(content) : null}
                                 move={canMove ? (m) => this.moveContent(content, m) : null}
                                 key={key}/>
            }
            return <UserRow user={content} remove={canRemove ? () => this.removeContent(content) : null}
                            add={canAdd ? () => this.addContent(content) : null}
                            move={canMove ? (m) => this.moveContent(content, m) : null}
                            key={key}/>
        } else if (this.type === "list") {
            if (this.state.useCards) {
                return <ListCard list={content} add={canAdd ? () => this.addContent(content) : null}
                                 remove={canRemove ? () => this.removeContent(content) : null}
                                 move={canMove ? (m) => this.moveContent(content, m) : null}
                                 key={key}/>
            }
            return <ListRow list={content} remove={canRemove ? () => this.removeContent(content) : null}
                            add={canAdd ? () => this.addContent(content) : null}
                            move={canMove ? (m) => this.moveContent(content, m) : null}
                            key={key}/>
        } else {
            console.error("Unknown type of content:", this.type)
        }
    }

    render() {
        // Hack to set unique ids of filter collapse
        const randString = Math.random().toString(36).slice(2)
        return <>
            <div className={"card card-body bg-2 mb-2"}>
                <div>
                    <button className={"btn btn-outline-primary mb-2"} type={"button"}
                            onClick={() => this.setState({filterExpanded: !this.state.filterExpanded})}
                            aria-expanded="false" aria-controls={"collapseFilter"}>
                        <FontAwesomeIcon icon={["fas", "filter"]}/> Filter
                    </button>
                    <button className={"btn btn-outline-secondary mx-2 mb-2"} type={"button"}
                            onClick={() => this.setState({useCards: !this.state.useCards})}>
                        <FontAwesomeIcon icon={["fas", (this.state.useCards ? "th-list" : "th-large")]}
                                         className={"me-2"}/>
                        {this.state.useCards ? "List" : "Grid"}
                    </button>
                    {this.state.columns.length > 0 ?
                        <button className={"btn btn-outline-secondary me-2 mb-2"} type={"button"}
                                onClick={() => this.setState({compactView: !this.state.compactView})}>
                            <FontAwesomeIcon icon={["fas", (this.state.compactView ? "expand" : "compress")]}
                                             className={"me-2"}/>
                            {this.state.compactView ? "More details" : "Less details"}
                        </button> : <></>}
                    <div className={"float-end"}>
                        {!this.canEdit ? <></> : <Link href={"/edit/" + this.type + "/_new"}>
                            <a className={"btn btn-outline-success mb-2 me-2"}>
                                <FontAwesomeIcon icon={["fas", "plus"]}/> Create a new {this.type}
                            </a>
                        </Link>}
                        {this.forceEditMode || !this.canEdit ? <></> :
                            <button className={"btn btn-outline-warning mb-2"} type={"button"}
                                    onClick={() => this.setState({editView: !this.state.editView})}>
                                {this.state.editView ? "Exit" : <FontAwesomeIcon icon={["fas", "edit"]}/>} edit-mode
                            </button>
                        }
                    </div>
                </div>
                <div id={"collapseFilterBoard-" + randString}
                     className={"collapse" + (this.state.filterExpanded ? " show" : "")}>
                    <ColumnFilter columns={this.state.columns} onChange={console.log}/>
                    <div className={"input-group mb-2"}>
                        <span className="input-group-text" id="inputSearchStringAddon">
                            <FontAwesomeIcon icon={["fas", "search"]}/>
                        </span>
                        <input value={this.state.searchString} type={"text"} className={"form-control"}
                               onChange={(e) => this.setState({
                                   searchString: e.target.value
                               })} aria-label={"Search input"} placeholder={"Type something to search..."}
                               aria-describedby={"inputSearchStringAddon"}/>
                    </div>
                    <span className={"text-muted"}>
                        This is a placeholder text
                    </span>
                </div>
            </div>
            <div className={"d-flex flex-wrap mb-2"}>
                {this.state.content.filter(c => c.name.toLowerCase()
                    .includes(this.state.searchString.toLowerCase())
                ).length === 0 ? <span className={"text-muted"}>
                    Nothing could be found
                </span> : <></>}
                {this.state.content.filter(c => c.name.toLowerCase()
                    .includes(this.state.searchString.toLowerCase())
                ).map(i => this.renderSingleContent(
                    i,
                    this.canMove && this.state.editView && this.updateContentURL !== "",
                    false,
                    this.state.editView
                ))}
            </div>
            {this.state.editView ? <>
                <hr/>
                <div className={"d-flex flex-wrap mb-2"}>
                    {this.state.unselectedContent.filter(c => c.name.toLowerCase()
                        .includes(this.state.searchString.toLowerCase())
                    ).length === 0 ?
                        <span className={"text-muted"}>
                            There is nothing to be added anymore
                        </span> : <></>}
                    {this.state.unselectedContent.filter(c => c.name.toLowerCase()
                        .includes(this.state.searchString.toLowerCase())
                    ).map(i => this.renderSingleContent(i, false, true))}
                </div>
            </> : <></>}
            {!this.canEdit ? <></> : <Link href={"/edit/" + this.type + "/_new"}>
                <a className={"btn btn-outline-success mb-2 me-2"}>
                    <FontAwesomeIcon icon={["fas", "plus"]}/> Create a new {this.type}
                </a>
            </Link>}
        </>
    }
}
