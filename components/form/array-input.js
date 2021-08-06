import React from "react";
// import {WithContext as ReactTags} from "react-tag-input";

const KeyCodes = {
    comma: 188,
    enter: [10, 13],
}

const delimiters = [...KeyCodes.enter, KeyCodes.comma]

export default class ArrayInput extends React.Component {
    constructor({_id, title, description, tags, suggestions, onChange}) {
        super(undefined);

        this.state = {
            tags,
            suggestions
        }
        this._id = _id
        this.title = title
        this.description = description
        this.onChange = onChange
        this.handleDelete = this.handleDelete.bind(this)
        this.handleAddition = this.handleAddition.bind(this)
        this.handleDrag = this.handleDrag.bind(this)
    }

    handleDelete(i) {
        const {tags} = this.state
        this.setState({
            tags: tags.filter((tag, index) => index !== i),
        })
    }

    handleAddition(tag) {
        this.setState(state => ({tags: [...state.tags, tag]}))
    }

    handleDrag(tag, currPos, newPos) {
        const tags = [...this.state.tags]
        const newTags = tags.slice()

        newTags.splice(currPos, 1)
        newTags.splice(newPos, 0, tag)

        // re-render
        this.setState({tags: newTags})
    }

    render() {
        /*const {tags, suggestions} = this.state

        <ReactTags id={"arrayFilter-" + this._id}
        tags={tags}
        allowDragDrop={false}
        minQueryLength={1}
        suggestions={suggestions}
        handleDelete={this.handleDelete}
        handleAddition={this.handleAddition}
        handleDrag={this.handleDrag}
        delimiters={delimiters}/>
        */
        return <>
            <label htmlFor={"arrayFilter-" + this._id}>
                {this.title}
            </label>
            <div id={"arrayFilterHelp-" + this._id} className="form-text">
                {this.description}
            </div>
        </>
    }
}
