import React from "react"
import Link from "next/link"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export default class EditUser extends React.Component {
    constructor({uid, accountType, description}) {
        super({uid, accountType, description})

        this.originalAccountType = accountType
        this.state = {
            uid,
            accountType,
            description
        }
    }

    saveUser() {
        if (this.state.accountType !== "") {
            if (this.originalAccountType === "admin" && this.state.accountType !== "admin") {
                if (!confirm("Do you really want to revoke admin rights?")) {
                    return
                }
            }

            let body = {
                uid: this.state.uid,
                accountType: this.state.accountType,
                description: this.state.description
            }

            fetch("/api/edit/user", {
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
            alert("Wow, wow! Wait a minute bro, you forgot to set the account type")
        }
    }

    render() {
        return <form>
            <div className="form-floating mb-3">
                <select className="form-select" id="userTypeInput" aria-label="Account type of user"
                        onChange={(e) => this.setState({
                            type: e.target.value
                        })} value={this.state.accountType}>
                    <option value="user">
                        User
                    </option>
                    <option value="editor">
                        Editor
                    </option>
                    <option value="admin">
                        Admin
                    </option>
                </select>
                <label htmlFor="userTypeInput" className={"text-dark"}>
                    Type of user account
                </label>
            </div>
            <div className="mb-3">
                <label htmlFor="createUserInputDescription" className="form-label">Description</label>
                <textarea className="form-control" id="createUserInputDescription" rows="3"
                          placeholder={"Enter a fitting description"} value={this.state.description}
                          onChange={(input) => {
                              this.setState({description: input.target.value})
                          }}/>
            </div>

            <button className={"btn btn-primary"} type="button" onClick={() => this.saveUser()}>
                <FontAwesomeIcon icon={["fas", "save"]} className={"me-2"}/>
                Save changes
            </button>
            <span className={"float-end"}>
                <Link href={"/users"}>
                    <a className={"btn btn-outline-secondary"}>
                        User manager
                        <FontAwesomeIcon icon={["fas", "arrow-alt-circle-right"]} className={"ms-2"}/>
                    </a>
                </Link>
            </span>
        </form>
    }
}
