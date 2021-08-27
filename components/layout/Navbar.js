import Image from "next/image"
import Link from "next/link"
import Profile from "./Profile"
import {useSession} from "next-auth/client"
import IconAdd from "../icons/IconAdd"
import {canEdit} from "../../lib/session"
import IconTable from "../icons/IconTable"
import IconTab from "../icons/IconTab"
import IconItem from "../icons/IconItem"
import IconColumn from "../icons/IconColumn"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import useSWR from "swr"
import Loader from "../loading"
import Dropdown from "./Dropdown";
import {useState} from "react";

export default function Navbar() {
    const [session] = useSession()
    const [dropdowns, setDropdowns] = useState([false, false])

    const {data: tabs, error} = useSWR("/api/tabs")
    if (error) {
        return <div>failed to load</div>
    }
    if (!tabs) {
        return <Loader/>
    }

    return <nav className="navbar navbar-expand-md navbar-dark bg-2">
        <div className="container-fluid">
            <Link href={"/"}>
                <a className="navbar-brand pb-0">
                    <Image src="/img/logo.png" alt="r/animepiracy Logo" width="32" height="32"
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
                    <Dropdown show={dropdowns[0]} toggler={<FontAwesomeIcon icon={["fas", "database"]}/>} contentList={[
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
                        </Link>
                    ]} toggle={(newShow) => setDropdowns(calculateDropdownStates(newShow, dropdowns, 0))}/>
                    {tabs.length === 0 ?
                        <li className="nav-item">
                            <a className="nav-link text-muted">
                                No tabs found
                            </a>
                        </li> : <></>}
                    {tabs.map(({urlId, name, tables}, i) =>
                        <Dropdown show={dropdowns[i + 2]} key={urlId} toggler={name}
                                  head={
                                      <Link href={"/tab/" + urlId}>
                                          <a className="dropdown-item">
                                              {name}
                                          </a>
                                      </Link>
                                  }
                                  contentList={
                                      tables.length === 0 ? [
                                          <a className={"dropdown-item text-muted"} key={"noTablesFound"}>
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
                                      calculateDropdownStates(newShow, dropdowns, i + 2)
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
                        <Dropdown show={dropdowns[1]} toggler={<FontAwesomeIcon icon={["fas", "users"]}/>}
                                  dropLeft={true} head={
                            <Link href={"/users"}>
                                <a className={"dropdown-item"} title={"Users"}>
                                    <FontAwesomeIcon icon={["fas", "users"]}/> Community
                                </a>
                            </Link>
                        } contentList={[
                            <a className={"dropdown-item"} href="https://wiki.piracy.moe/" key={"wiki"}>
                                <img height={21} width={21} className={"me-1"} style={{marginTop: -5}}
                                     src={"/icons/wikijs.svg"} alt={"Wiki.js logo"}/>
                                Wiki
                            </a>,
                            <a className={"dropdown-item"} href="https://status.piracy.moe/" key={"status"}>
                                <img height={21} width={21} className={"me-1"} style={{marginTop: -5}}
                                     src={"/icons/status.png"} alt={"Checkly logo"}/>
                                Status
                            </a>,
                            <a className={"dropdown-item"} href="https://releases.moe/" key={"seadex"}>
                                <img height={21} width={21} className={"me-1"} style={{marginTop: -5}}
                                     src={"/icons/seadex.png"} alt={"Seadex logo"}/>
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
                        ]} toggle={(newShow) => setDropdowns(calculateDropdownStates(newShow, dropdowns, 1))}/>
                        <Profile/>
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
