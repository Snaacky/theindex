import React from "react"
import Link from "next/link"
import Image from "next/image"
import styles from "./Navbar.module.css"
import NavbarBrand from "./NavbarBrand"
import NavbarUser from "./NavbarUser"
import NavbarDropdown from "./NavbarDropdown"
import IconLibrary from "../icons/IconLibrary"
import IconCollection from "../icons/IconCollection"
import IconColumn from "../icons/IconColumn"
import IconItem from "../icons/IconItem"
import IconList from "../icons/IconList"
import LoginOrOutButton from "../buttons/LoginOrOutButton"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import useSWR from "swr"
import NavbarToggler from "./NavbarToggler"
import {isAdmin} from "../../lib/session"
import {useSession} from "next-auth/client"
import IconAdmin from "../icons/IconAdmin"

function Sidebar(
    {
        show,
        setShow
    }, ref) {
    const [session] = useSession()
    const {data} = useSWR("/api/libraries")
    const libraries = data ?? []

    return <div className={styles.sidebar + " offcanvas offcanvas-start fade" + (show ? " show" : "")} ref={ref}
                id={"navbarOffcanvas"} tabIndex="-1" aria-hidden={(!show).toString()} role={"dialog"}>
        <div className={styles.header + " offcanvas-header"}>
            <div className={"container-fluid d-flex flex-row align-items-center"}>
                <NavbarBrand/>

                <NavbarToggler show={show} onClick={() => setShow(!show)} className={"ms-auto"}/>
            </div>
        </div>

        <div className="offcanvas-body">
            <nav role={"navigation"}>
                <ul className={"nav nav-pills flex-column"}>
                    <NavbarUser/>
                    {isAdmin(session) ?
                        <li className={"nav-item"}>
                            <Link href={"/admin"}>
                                <a className={"nav-link"} title={"Admin settings"}>
                                    <IconAdmin/> Admin
                                </a>
                            </Link>
                        </li> : <></>
                    }
                </ul>
                <hr/>

                <ul className={"nav nav-pills flex-column"}>
                    {libraries.length === 0 ?
                        <li className={"nav-item"}>
                            <a href={"#"} className="nav-link text-muted">
                                No libraries found
                            </a>
                        </li> : <></>}
                    {libraries.map(({urlId, name, collections}) =>
                        <NavbarDropdown
                            key={urlId} toggler={name} targetId={"navbar-menu-" + urlId}
                            viewAllUrl={"/library/" + urlId}
                            contentList={
                                collections.length === 0 ? [
                                    <a href={"#"} className={"nav-link text-muted"}
                                       key={"noCollectionsFound"}>
                                        No collections found
                                    </a>
                                ] : collections.map((collection) => {
                                    return <Link href={"/collection/" + collection.urlId}
                                                 key={collection.urlId}>
                                        <a className={"nav-link"}>
                                            {collection.name}
                                        </a>
                                    </Link>
                                })
                            }/>
                    )}
                </ul>

                <hr/>
                <ul className={"nav nav-pills flex-column"}>
                    <li className={"nav-item"}>
                        <Link href={"/libraries"}>
                            <a className={"nav-link"}>
                                <IconLibrary/> Libraries
                            </a>
                        </Link>
                    </li>
                    <li className={"nav-item"}>
                        <Link href={"/collections"}>
                            <a className={"nav-link"}>
                                <IconCollection/> Collections
                            </a>
                        </Link>
                    </li>
                    <li className={"nav-item"}>
                        <Link href={"/columns"}>
                            <a className={"nav-link"}>
                                <IconColumn/> Columns
                            </a>
                        </Link>
                    </li>
                    <li className={"nav-item"}>
                        <Link href={"/items"}>
                            <a className={"nav-link"}>
                                <IconItem/> Items
                            </a>
                        </Link>
                    </li>
                    <li className={"nav-item"}>
                        <Link href={"/users"}>
                            <a className={"nav-link"}>
                                <FontAwesomeIcon icon={["fas", "users"]}/> Users
                            </a>
                        </Link>
                    </li>
                    <li className={"nav-item"}>
                        <Link href={"/lists"}>
                            <a className={"nav-link"}>
                                <IconList/> User lists
                            </a>
                        </Link>
                    </li>
                </ul>

                <hr/>
                <ul className={"nav nav-pills flex-column"}>
                    <NavbarDropdown
                        toggler={"Other services"} targetId={"navbar-menu-services"}
                        contentList={[
                            <a className={"nav-link"} href="https://wiki.piracy.moe/" key={"wiki"}>
                                <Image src={"/icons/wikijs.svg"} height={16} width={16}
                                       alt={"Wiki.js logo"}/>
                                <span className={"ms-1"}>
                                    Wiki
                                </span>
                            </a>,
                            <a className={"nav-link"} href="https://status.piracy.moe/" key={"status"}>
                                <Image src={"/icons/status.png"} height={16} width={16}
                                       alt={"Checkly logo"}/>
                                <span className={"ms-1"}>
                                    Status
                                </span>
                            </a>,
                            <a className={"nav-link"} href="https://releases.moe/" key={"seadex"}>
                                <Image src={"/icons/seadex.png"} height={16} width={16}
                                       alt={"Seadex logo"}/>
                                <span className={"ms-1"}>
                                    SeaDex
                                </span>
                            </a>
                        ]}/>
                    <NavbarDropdown
                        toggler={"Social media"} targetId={"navbar-menu-social-media"}
                        contentList={[
                            <a className={"nav-link"} href={"https://www.reddit.com/r/animepiracy/"} key={"reddit"}
                               target={"_blank"} rel="noreferrer">
                                <FontAwesomeIcon icon={["fab", "reddit"]}/> Reddit
                            </a>,
                            <a className={"nav-link"} href={"https://discord.gg/piracy"} key={"discord"}
                               target={"_blank"} rel="noreferrer">
                                <FontAwesomeIcon icon={["fab", "discord"]}/> Discord
                            </a>,
                            <a className={"nav-link"} href={"https://twitter.com/ranimepiracy"} key={"twitter"}
                               target={"_blank"} rel="noreferrer">
                                <FontAwesomeIcon icon={["fab", "twitter"]}/> Twitter
                            </a>,
                            <a className={"nav-link"} href={"https://github.com/ranimepiracy/index"} key={"github"}
                               target={"_blank"} rel="noreferrer">
                                <FontAwesomeIcon icon={["fab", "github"]}/> Github
                            </a>
                        ]}/>
                </ul>

                <hr/>
                <div className={"d-flex justify-content-center"}>
                    <LoginOrOutButton/>
                </div>
            </nav>
        </div>
    </div>
}

export default React.forwardRef(Sidebar)
