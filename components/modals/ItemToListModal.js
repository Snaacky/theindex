import Link from "next/link"
import Modal from "./Modal"
import {useState} from "react"
import useSWR from "swr"
import Error from "../../pages/_error"
import IconEdit from "../icons/IconEdit"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export default function ItemToListModal({item, close}) {
    const {data: user, error} = useSWR("/api/user/me")
    const [checked, setChecked] = useState([])
    const [init, setInit] = useState(false)

    if (error) {
        return <Error error={error} statusCode={error.status}/>
    } else if (!user) {
        return <></>
    } else if (!init) {
        setInit(true)
        console.log("ItemToListModal", user.lists)
        setChecked(user.lists.map(l => l.items.some(it => it === item._id)))
    }
    return <Modal close={close}
                  head={
                      <>
                          Add <kbd className={"text-success"}>{item.name}</kbd> to your list
                      </>
                  }
                  body={
                      <div className={"container-fluid"}>
                          {user.lists.length > 0 ? <></> : <span className={"text-muted"}>
                              You have no lists created yet
                          </span>}
                          {user.lists.map((l, i) => <div className={"form-check"} key={l._id}>
                              <input className={"form-check-input"} type={"checkbox"} id={"itemToListModalCheck-" + i}
                                     checked={checked[i]}
                                     onChange={() => {
                                         // this is the pre toggled state
                                         l.items = checked[i] ? l.items.filter(i => i !== item._id) :
                                             l.items.concat([item._id])
                                         let body = {
                                             _id: l._id,
                                             items: l.items
                                         }

                                         fetch("/api/edit/list", {
                                             method: "post",
                                             headers: {"Content-Type": "application/json"},
                                             body: JSON.stringify(body)
                                         }).then(r => {
                                             if (r.status !== 200) {
                                                 alert("Failed to save data: Error " + r.status)
                                             }
                                         })
                                         setChecked(checked.map((c, ci) => ci === i ? !c : c))
                                     }}/>
                              <label className={"form-check-label"} htmlFor={"itemToListModalCheck-" + i}>
                                  {l.name}
                              </label>
                              <Link href={"/edit/list/" + l._id}>
                                  <a className={"float-end"}>
                                      <IconEdit/>
                                  </a>
                              </Link>
                          </div>)}
                      </div>
                  }
                  footer={
                      <span>
                          <Link href={"/edit/list/_new"}>
                              <a className={"btn btn-outline-success"}>
                                  <FontAwesomeIcon icon={["fas", "plus"]}/> Create a new list
                              </a>
                          </Link>
                      </span>
                  }/>
}
