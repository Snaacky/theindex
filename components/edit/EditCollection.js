import React from "react"
import Image from "next/image"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import EditSelectImg from "./EditSelectImg"
import {toast} from "react-toastify"
import {postData} from "../../lib/utils"

export default class EditCollection extends React.Component {
    constructor({collections, _id, urlId, img, name, nsfw, description}) {
        super({collections, _id, urlId, img, name, nsfw, description})

        this.collectionsDatalist = collections.map(t => t.name)
        this.urlDatalist = collections.map(t => t.urlId)

        this.state = {
            _id,
            urlId: urlId || "",
            img: img || "puzzled.png",
            name: name || "",
            nsfw: nsfw || false,
            description: description || ""
        }
    }

    saveCollection() {
        if (this.state.name !== "" && this.state.urlId !== "") {
            if (this.state.urlId === "_new") {
                return toast.error("Illegal url id: '_new' is forbidden!")
            }

            let body = {
                urlId: this.state.urlId,
                img: this.state.img,
                name: this.state.name,
                nsfw: this.state.nsfw,
                description: this.state.description
            }
            if (this.state._id) {
                body._id = this.state._id
            }

            postData("/api/edit/collection", body, () => {
                if (typeof this.state._id === "undefined") {
                    window.location.href = escape("/collections")
                }
            })
        } else {
            toast.warn("Wow, wow! Wait a minute bro, you forgot to fill in the name and url id")
        }
    }

    render() {
        return <form>
            <div className={"row"}>
                <div className={"col-12 col-lg-6 mb-3"}>
                    <label htmlFor={"createCollectionInputImage"} className={"form-label"}>
                        Image
                    </label>
                    <div className={"d-flex align-items-center p-2 rounded bg-6"}>
                        <Image src={"/img/" + this.state.img} alt={"Image for collection"} width={"148px"}
                               height={"148px"}/>
                        <div className={"ms-2 d-flex flex-row w-100 justify-content-center"}>
                            <EditSelectImg selected={this.state.img}
                                           onChange={(i) => this.setState({img: i})}/>
                        </div>
                    </div>
                    <div id={"createCollectionInputImageHelp"} className={"form-text"}>
                        The image of the collection
                    </div>
                </div>
                <div className={"col-12 col-lg-6 mb-3"}>
                    <label htmlFor={"createCollectionInputName"} className={"form-label"}>
                        Name
                    </label>
                    <input type={"text"} className={"form-control"} id={"createCollectionInputName"}
                           value={this.state.name}
                           list={"createCollectionInputNameDatalist"} aria-describedby={"createCollectionInputNameHelp"}
                           placeholder={"Enter a name"} required={true}
                           onChange={(input) => {
                               this.setState({name: input.target.value})
                           }}/>
                    <datalist id={"createCollectionInputNameDatalist"}>
                        {this.collectionsDatalist.map(t => <option value={t} key={t}/>)}
                    </datalist>
                    <div id={"createCollectionInputNameHelp"} className={"form-text"}>
                        Shown name of collection
                    </div>
                    <label htmlFor={"createCollectionInputURL"} className={"form-label"}>
                        URL
                    </label>
                    <input type={"text"} className={"form-control"} id={"createCollectionInputURL"}
                           value={this.state.urlId}
                           list={"createCollectionInputURLDatalist"} aria-describedby={"createCollectionInputURLHelp"}
                           placeholder={"Enter the url id"} required={true}
                           onChange={(input) => {
                               this.setState({urlId: input.target.value})
                           }}/>
                    <datalist id={"createCollectionInputURLDatalist"}>
                        {this.urlDatalist.map(t => <option value={t} key={t}/>)}
                    </datalist>
                    <div id={"createCollectionInputURLHelp"} className={"form-text"}>
                        Identifier used for the URLs, must be a string containing only <code>[a-z0-9-_]</code>
                    </div>
                </div>
            </div>
            <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="createCollectionInputNSFW"
                       checked={this.state.nsfw}
                       onChange={(input) => {
                           this.setState({nsfw: input.target.checked})
                       }}/>
                <label className="form-check-label" htmlFor="createCollectionInputNSFW">
                    NSFW: contains adult only content
                </label>
            </div>
            <div className="mb-3">
                <label htmlFor="createCollectionInputDescription" className="form-label">Description</label>
                <textarea className="form-control" id="createCollectionInputDescription" rows="3"
                          placeholder={"Enter a fitting description"} value={this.state.description}
                          onChange={(input) => {
                              this.setState({description: input.target.value})
                          }}/>
            </div>
            <span className={"float-end"}>
                <button className={"btn btn-primary mb-2 me-2"} type="button" onClick={() => this.saveCollection()}>
                    <FontAwesomeIcon icon={["fas", "save"]} className={"me-2"}/>
                    {typeof this.state._id === "undefined" ? "Create collection" : "Save changes"}
                </button>
            </span>
        </form>
    }
}
