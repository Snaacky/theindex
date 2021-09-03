import Image from "next/image"
import Link from "next/link"
import {signIn, signOut, useSession} from "next-auth/client"
import IconAdd from "../icons/IconAdd"
import {canEdit, isAdmin, isLogin} from "../../lib/session"
import IconTable from "../icons/IconTable"
import IconTab from "../icons/IconTab"
import IconItem from "../icons/IconItem"
import IconColumn from "../icons/IconColumn"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import useSWR from "swr"
import Dropdown from "./Dropdown"
import {useState} from "react"
import IconAdmin from "../icons/IconAdmin"
import IconList from "../icons/IconList"

export default function Navbar() {
    const [session] = useSession()
    const [dropdowns, setDropdowns] = useState([false, false, false])

    const {data, error} = useSWR("/api/tabs")
    if (error) {
        return <div>failed to load</div>
    }
    const tabs = data ?? []

    return <nav className="navbar navbar-expand-md navbar-dark bg-2">
        <div className="container-fluid">
            <Link href={"/"}>
                <a className="navbar-brand pb-0">
                    <Image src="/icons/logo.png" alt="r/animepiracy Logo" width="32" height="32"
                           className="d-inline-block rounded align-top"/>
                    <span className={"ms-2 d-sm-inline-block d-none align-top"}>
                        The Anime Index
                    </span>
                </a>
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>

            <div className="collapse navbar-collapse" id="navbarToggler">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <Dropdown show={dropdowns[0]} toggler={<FontAwesomeIcon icon={["fas", "database"]}/>}
                              hideCavet={true}
                              contentList={[
                                  <Link href={"/tabs"} key={"tabs"}>
                                      <a className="dropdown-item">
                                          <IconTab/> Tabs
                                      </a>
                                  </Link>,
                                  <Link href={"/tables"} key={"tables"}>
                                      <a className="dropdown-item">
                                          <IconTable/> Tables
                                      </a>
                                  </Link>,
                                  <Link href={"/columns"} key={"columns"}>
                                      <a className="dropdown-item">
                                          <IconColumn/> Columns
                                      </a>
                                  </Link>,
                                  <Link href={"/items"} key={"items"}>
                                      <a className="dropdown-item">
                                          <IconItem/> Items
                                      </a>
                                  </Link>,
                                  <hr className="dropdown-divider" key={"divider"}/>,
                                  <Link href={"/users"} key={"users"}>
                                      <a className={"dropdown-item"} title={"Users"}>
                                          <FontAwesomeIcon icon={["fas", "users"]}/> Users
                                      </a>
                                  </Link>,
                                  <Link href={"/lists"} key={"lists"}>
                                      <a className={"dropdown-item"}>
                                          <IconList/> User lists
                                      </a>
                                  </Link>
                              ]} toggle={(newShow) => setDropdowns(calculateDropdownStates(newShow, dropdowns, 0))}/>
                    {tabs.length === 0 ?
                        <li className="nav-item">
                            <a href={"#"} className="nav-link text-muted">
                                No tabs found
                            </a>
                        </li> : <></>}
                    {tabs.map(({urlId, name, tables}, i) =>
                        <Dropdown show={dropdowns[i + 3]} key={urlId} toggler={name}
                                  head={
                                      <Link href={"/tab/" + urlId}>
                                          <a className="dropdown-item">
                                              {name}
                                          </a>
                                      </Link>
                                  }
                                  contentList={
                                      tables.length === 0 ? [
                                          <a href={"#"} className={"dropdown-item text-muted"} key={"noTablesFound"}>
                                              No tables found
                                          </a>
                                      ] : tables.map((table) => {
                                          return <Link href={"/table/" + table.urlId} key={table.urlId}>
                                              <a className="dropdown-item">
                                                  {table.name}
                                              </a>
                                          </Link>
                                      })
                                  }
                                  toggle={(newShow) => setDropdowns(
                                      calculateDropdownStates(newShow, dropdowns, i + 3)
                                  )}/>
                    )}
                    {canEdit(session) ? <li className={"nav-item"}>
                            <Link href={"/edit/tab/_new"}>
                                <a className={"nav-link"} style={{
                                    padding: 0,
                                    height: "40px",
                                    width: "40px",
                                }} title={"Create a new tab"}>
                                    <IconAdd/>
                                </a>
                            </Link>
                        </li> :
                        <></>
                    }
                </ul>
                <form className="d-flex">
                    <ul className="navbar-nav">
                        <Dropdown show={dropdowns[1]} toggler={<FontAwesomeIcon icon={["fas", "ellipsis-h"]}/>}
                                  dropLeft={true} hideCavet={true}
                                  contentList={[
                                      <a className={"dropdown-item"} href="https://wiki.piracy.moe/" key={"wiki"}>
                                          <span className={"me-1"}>
                                              <Image src={"/icons/wikijs.svg"} height={21} width={21}
                                                     alt={"Wiki.js logo"}/>
                                          </span>
                                          Wiki
                                      </a>,
                                      <a className={"dropdown-item"} href="https://status.piracy.moe/" key={"status"}>
                                          <span className={"me-1"}>
                                              <Image src={"/icons/status.png"} height={21} width={21}
                                                     alt={"Checkly logo"}/>
                                          </span>
                                          Status
                                      </a>,
                                      <a className={"dropdown-item"} href="https://releases.moe/" key={"seadex"}>
                                          <span className={"me-1"}>
                                              <Image src={"/icons/seadex.png"} height={21} width={21}
                                                     alt={"Seadex logo"}/>
                                          </span>
                                          SeaDex
                                      </a>,
                                      <hr className="dropdown-divider" key={"divider"}/>,
                                      <a href={"https://www.reddit.com/r/animepiracy/"} className={"dropdown-item"}
                                         target={"_blank"} rel="noreferrer" key={"reddit"}>
                                          <FontAwesomeIcon icon={["fab", "reddit"]}/> Reddit
                                      </a>,
                                      <a href={"https://discord.gg/piracy"} className="dropdown-item"
                                         target={"_blank"} rel="noreferrer" key={"discord"}>
                                          <FontAwesomeIcon icon={["fab", "discord"]}/> Discord
                                      </a>,
                                      <a href={"https://twitter.com/ranimepiracy"} className="dropdown-item"
                                         target={"_blank"} rel="noreferrer" key={"twitter"}>
                                          <FontAwesomeIcon icon={["fab", "twitter"]}/> Twitter
                                      </a>,
                                      <a href={"https://github.com/ranimepiracy/index"} className="dropdown-item"
                                         target={"_blank"} rel="noreferrer" key={"github"}>
                                          <FontAwesomeIcon icon={["fab", "github"]}/> Github
                                      </a>
                                  ]}
                                  toggle={
                                      (newShow) => setDropdowns(calculateDropdownStates(newShow, dropdowns, 1))
                                  }/>
                        <Dropdown show={dropdowns[2]} dropLeft={true} hideCavet={true}
                                  toggler={
                                      isLogin(session) ?
                                          <div className={"d-flex"}>
                                              <Image src={session.user.image} width={21} height={21}
                                                     className={"rounded-circle"} alt={"Discord profile picture"}/>
                                          </div>
                                          : <FontAwesomeIcon icon={["fas", "user-circle"]}/>
                                  }
                                  contentList={
                                      (isLogin(session) ? [
                                          <Link href={"/user/" + session.user.uid} key={"users"}>
                                              <a className="dropdown-item">
                                                  <FontAwesomeIcon icon={["fas", "user-circle"]}/> {session.user.name}
                                              </a>
                                          </Link>
                                      ] : []).concat(
                                          isAdmin(session) ? [
                                              <Link href={"/admin"} key={"admin"}>
                                                  <a className={"dropdown-item"} title={"Admin settings"}>
                                                      <IconAdmin/> Admin
                                                  </a>
                                              </Link>,
                                              <hr className="dropdown-divider" key={"divider"}/>
                                          ] : []
                                      ).concat([
                                          <a className="dropdown-item" onClick={() => {
                                              if (session) {
                                                  signOut()
                                              } else {
                                                  signIn("discord")
                                              }
                                          }} key={"login-out"}>
                                              {session ? <>
                                                  Sign out <FontAwesomeIcon icon={["fas", "sign-out-alt"]}
                                                                            className={"text-danger"}/>
                                              </> : <>
                                                  <FontAwesomeIcon icon={["fas", "sign-in-alt"]}
                                                                   className={"text-success"}/> Sign In
                                              </>}
                                          </a>
                                      ])
                                  }
                                  toggle={
                                      (newShow) => setDropdowns(calculateDropdownStates(newShow, dropdowns, 2))
                                  }/>
                    </ul>
                </form>
            </div>
        </div>
    </nav>
}

function calculateDropdownStates(newShow, dropdowns, index) {
    let newDropdowns = []
    if (typeof dropdowns[index] === "undefined") {
        for (let i = 0; i < index; i++) {
            newDropdowns[i] = false
        }
        newDropdowns[index] = newShow
    } else {
        newDropdowns = dropdowns.map((show, i) => i === index ? newShow : false)
    }
    return newDropdowns
}
