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

export default function Navbar({tabs}) {
    const [session] = useSession()

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
                    <li className="nav-item dropdown">
                        <a className={"nav-link dropdown-toggle"} role="button"
                           data-bs-toggle="dropdown" aria-expanded="false"
                           id={"navDropdownLinkDatabase"}>
                            <FontAwesomeIcon icon={["fas", "database"]}/>
                        </a>
                        <ul className="dropdown-menu bg-4" aria-labelledby={"navDropdownLinkDatabase"}>
                            <li>
                                <Link href={"/tabs"}>
                                    <a className="dropdown-item">
                                        <IconTab/> Tabs
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href={"/tables"}>
                                    <a className="dropdown-item">
                                        <IconTable/> Tables
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href={"/columns"}>
                                    <a className="dropdown-item">
                                        <IconColumn/> Columns
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href={"/items"}>
                                    <a className="dropdown-item">
                                        <IconItem/> Items
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    {tabs.length === 0 ?
                        <li className="nav-item">
                            <a className="nav-link text-muted">
                                No tabs found
                            </a>
                        </li> : <></>}
                    {tabs.map(({urlId, name, tables}) => {
                        return <li className="nav-item dropdown" key={urlId}>
                            <a className={"nav-link dropdown-toggle"} role="button"
                               data-bs-toggle="dropdown" aria-expanded="false"
                               id={"navDropdownLink-" + urlId}>
                                {name}
                            </a>
                            <ul className="dropdown-menu bg-4" aria-labelledby={"navDropdownLink-" + urlId}>
                                <li>
                                    <Link href={"/tab/" + urlId}>
                                        <a className="dropdown-item">
                                            {name}
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <hr className="dropdown-divider"/>
                                </li>
                                {tables.length === 0 ? <li>
                                    <a className={"dropdown-item text-muted"}>
                                        No tables found
                                    </a>
                                </li> : <></>}
                                {
                                    tables.map((table) => {
                                        return <li key={table.urlId}>
                                            <Link href={"/table/" + table.urlId}>
                                                <a className="dropdown-item">
                                                    {table.name}
                                                </a>
                                            </Link>
                                        </li>
                                    })
                                }
                            </ul>
                        </li>
                    })}
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
                        <li className="nav-item dropdown">
                            <a className={"nav-link dropdown-toggle"} role="button"
                               data-bs-toggle="dropdown" aria-expanded="false"
                               id={"navDropdownLinkCommunity"}>
                                <FontAwesomeIcon icon={["fas", "users"]}/>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end bg-4"
                                aria-labelledby={"navDropdownLinkCommunity"}>
                                <li>
                                    <Link href={"/users"}>
                                        <a className={"dropdown-item"} title={"Users"}>
                                            <FontAwesomeIcon icon={["fas", "users"]}/> Community
                                        </a>
                                    </Link>
                                </li>
                                <div className={"d-block d-lg-none"}>
                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>
                                    <li>
                                        <a className={"dropdown-item"} href="https://wiki.piracy.moe/">
                                            <img height={21} width={21} className={"me-1"} style={{marginTop: -5}}
                                                 src={"/icons/wikijs.svg"} alt={"Wiki.js logo"}/>
                                            Wiki
                                        </a>
                                    </li>
                                    <li>
                                        <a className={"dropdown-item"} href="https://status.piracy.moe/">
                                            <img height={21} width={21} className={"me-1"} style={{marginTop: -5}}
                                                 src={"/icons/status.png"} alt={"Checkly logo"}/>
                                            Status
                                        </a>
                                    </li>
                                    <li>
                                        <a className={"dropdown-item"} href="https://releases.moe/">
                                            <img height={21} width={21} className={"me-1"} style={{marginTop: -5}}
                                                 src={"/icons/seadex.png"} alt={"Seadex logo"}/>
                                            SeaDex
                                        </a>
                                    </li>
                                </div>
                                <li>
                                    <hr className="dropdown-divider"/>
                                </li>
                                <li>
                                    <a href={"https://www.reddit.com/r/animepiracy/"} className={"dropdown-item"}
                                       target={"_blank"} rel="noreferrer">
                                        <FontAwesomeIcon icon={["fab", "reddit"]}/> Reddit
                                    </a>
                                </li>
                                <li>
                                    <a href={"https://discord.gg/piracy"} className="dropdown-item"
                                       target={"_blank"} rel="noreferrer">
                                        <FontAwesomeIcon icon={["fab", "discord"]}/> Discord
                                    </a>
                                </li>
                                <li>
                                    <a href={"https://twitter.com/ranimepiracy"} className="dropdown-item"
                                       target={"_blank"} rel="noreferrer">
                                        <FontAwesomeIcon icon={["fab", "twitter"]}/> Twitter
                                    </a>
                                </li>
                                <li>
                                    <a href={"https://github.com/ranimepiracy/index"} className="dropdown-item"
                                       target={"_blank"} rel="noreferrer">
                                        <FontAwesomeIcon icon={["fab", "github"]}/> Github
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <div className={"d-none d-lg-flex"}>
                            <li className="nav-item">
                                <a className="nav-link" href="https://wiki.piracy.moe/">
                                    <img height={21} width={21} className={"me-1"} style={{marginTop: -5}}
                                         src={"/icons/wikijs.svg"} alt={"Wiki.js logo"}/>
                                    Wiki
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="https://status.piracy.moe/">
                                    <img height={21} width={21} className={"me-1"} style={{marginTop: -5}}
                                         src={"/icons/status.png"} alt={"Checkly logo"}/>
                                    Status
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="https://releases.moe/">
                                    <img height={21} width={21} className={"me-1"} style={{marginTop: -5}}
                                         src={"/icons/seadex.png"} alt={"Seadex logo"}/>
                                    SeaDex
                                </a>
                            </li>
                        </div>
                        <Profile/>
                    </ul>
                </form>
            </div>
        </div>
    </nav>
}
