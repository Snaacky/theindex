import Image from "next/image"
import Link from "next/link"
import {signIn, signOut, useSession} from "next-auth/client"
import {isAdmin, isLogin} from "../../lib/session"
import IconCollection from "../icons/IconCollection"
import IconLibrary from "../icons/IconLibrary"
import IconItem from "../icons/IconItem"
import IconColumn from "../icons/IconColumn"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import useSWR from "swr"
import Dropdown from "./Dropdown"
import {useEffect, useRef, useState} from "react"
import IconAdmin from "../icons/IconAdmin"
import IconList from "../icons/IconList"
import styles from "./Navbar.module.css"
import Draggable from "react-draggable"

// in px padding of drag button constrain
const toggleButtonDragPadding = 30
const toggleButtonSize = 40

export default function Navbar() {
    const [session] = useSession()
    const [show, setShow] = useState(false)

    const [togglePosition, setTogglePosition] = useState({x: toggleButtonDragPadding, y: toggleButtonDragPadding})
    const [dragLocalStorageInit, setDragLocalStorageInit] = useState(false)
    const [dragging, setDragging] = useState(false)

    if (typeof localStorage !== "undefined" && !dragLocalStorageInit) {
        if (localStorage.getItem("togglePosition") !== null) {
            setTogglePosition(adjustDragPosition(JSON.parse(localStorage.getItem("togglePosition"))))
        }
        setDragLocalStorageInit(true)
    }

    const sidebarRef = useRef()
    const navbarToggleRef = useRef()
    const outsideToggleRef = useRef()

    useEffect(() => {
        const checkIfClickedOutside = e => {
            // If dropdown is open and the clicked target is not within the menu nor the toggle button itself
            if (show && sidebarRef && sidebarRef.current && !sidebarRef.current.contains(e.target) &&
                navbarToggleRef && navbarToggleRef.current && !navbarToggleRef.current.contains(e.target) &&
                outsideToggleRef && outsideToggleRef.current && !outsideToggleRef.current.contains(e.target)) {
                setShow(false)
            }
        }
        const updateToggleOnResize = () => {
            setTogglePosition(adjustDragPosition(togglePosition))
        }

        document.addEventListener("mousedown", checkIfClickedOutside)
        window.addEventListener("resize", updateToggleOnResize)

        return () => {
            // Cleanup
            document.removeEventListener("mousedown", checkIfClickedOutside)
            window.removeEventListener("resize", updateToggleOnResize)
        }
    })

    const {data, error} = useSWR("/api/libraries")
    if (error) {
        return <div>failed to load</div>
    }
    const libraries = data ?? []

    const toggleClick = () => {
        console.log("Click-event on toggle and did drag?", dragging)
        if (!dragging) {
            setShow(!show)
        } else {
            setDragging(false)
        }
    }
    return <>
        {dragLocalStorageInit ?
            <Draggable position={togglePosition}
                       onDrag={(e, {x, y}) => {
                           setTogglePosition({x, y})
                           if (typeof localStorage !== "undefined") {
                               localStorage.setItem("togglePosition", JSON.stringify({x, y}))
                           }
                           setDragging(true)
                       }}
                       onStop={(e, {x, y}) => {
                           console.log("Stop dragging at", {x, y})
                           setTogglePosition(adjustDragPosition({x, y}))
                       }}>
                <button className={styles.outside + " " + styles.toggler + " btn shadow"} type="button"
                        aria-label="Toggle navigation" ref={outsideToggleRef}
                        onClick={() => toggleClick()} onTouchStart={() => toggleClick()}>
                    <FontAwesomeIcon icon={["fas", show ? "times" : "bars"]}/>
                </button>
            </Draggable> : <></>
        }

        <div className={styles.navbar}>
            <div className={styles.header + " offcanvas-header"}>
                <div className={"d-flex flex-row justify-content-center"}>
                    <Link href={"/"}>
                        <a className={"navbar-brand"}>
                            <Image src="/icons/logo.png" alt="r/animepiracy Logo" width="32" height="32"
                                   className="d-inline-block rounded align-top"/>
                            <span className={"ms-2 align-top"}>
                            The Anime Index
                        </span>
                        </a>
                    </Link>

                    <ul className={"nav nav-pills"}>
                        <li className={"nav-item"}>
                            <a className={"nav-link"} href="https://wiki.piracy.moe/" key={"wiki"}>
                                <Image src={"/icons/wikijs.svg"} height={24} width={24}
                                       alt={"Wiki.js logo"}/>
                                <span className={"ms-1"}>
                                Wiki
                            </span>
                            </a>
                        </li>
                        <li className={"nav-item"}>
                            <a className={"nav-link"} href="https://status.piracy.moe/" key={"status"}>
                                <Image src={"/icons/status.png"} height={24} width={24}
                                       alt={"Checkly logo"}/>
                                <span className={"ms-1"}>
                                Status
                            </span>
                            </a>
                        </li>
                        <li className={"nav-item"}>
                            <a className={"nav-link"} href="https://releases.moe/" key={"seadex"}>
                                <Image src={"/icons/seadex.png"} height={24} width={24}
                                       alt={"Seadex logo"}/>
                                <span className={"ms-1"}>
                                SeaDex
                            </span>
                            </a>
                        </li>
                    </ul>
                </div>

                <div className={"d-flex flex-row"}>
                    {isLogin(session) ?
                        <ul className={"nav nav-pills"}>
                            <li className={"nav-item"}>
                                <Link href={"/user/" + session.user.uid} key={"users"}>
                                    <a className={"nav-link"}>
                                        <Image src={session.user.image} width={24} height={24}
                                               className={"rounded-circle"}
                                               alt={session.user.name + "'s profile picture"}/>
                                        <span className={"ms-2"}>
                                            {session.user.name}
                                        </span>
                                    </a>
                                </Link>
                            </li>
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
                        : <></>
                    }
                    <button className={styles.toggler + " btn shadow ms-2"} type="button" aria-label="Close navigation"
                            onClick={() => setShow(!show)} ref={navbarToggleRef}>
                        <FontAwesomeIcon icon={["fas", show ? "times" : "bars"]}/>
                    </button>
                </div>
            </div>
        </div>

        <div className={styles.sidebar + " offcanvas offcanvas-start fade" + (show ? " show" : "")} ref={sidebarRef}
             id={"navbarOffcanvas"} tabIndex="-1" aria-hidden={(!show).toString()} role={"dialog"}>
            <div className={styles.header + " offcanvas-header"}>
                <Link href={"/"}>
                    <a className={"navbar-brand"}>
                        <Image src="/icons/logo.png" alt="r/animepiracy Logo" width="32" height="32"
                               className="d-inline-block rounded align-top"/>
                        <span className={"ms-2 align-top"}>
                            The Anime Index
                        </span>
                    </a>
                </Link>

                <button className={styles.toggler + " " + styles.mobile + " btn shadow"} type="button"
                        aria-label="Close navigation" onClick={() => setShow(!show)}>
                    <FontAwesomeIcon icon={["fas", show ? "times" : "bars"]}/>
                </button>
            </div>
            <div className="offcanvas-body">
                <nav role={"navigation"}>
                    <div className={styles.mobile}>
                        {isLogin(session) ?
                            <ul className={"nav nav-pills flex-column"}>
                                <li className={"nav-item"}>
                                    <Link href={"/user/" + session.user.uid} key={"users"}>
                                        <a className={"nav-link"}>
                                            <Image src={session.user.image} width={16} height={16}
                                                   className={"rounded-circle"}
                                                   alt={session.user.name + "'s profile picture"}/>
                                            <span className={"ms-2"}>
                                                {session.user.name}
                                            </span>
                                        </a>
                                    </Link>
                                </li>
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
                            : <></>
                        }
                        <hr/>
                    </div>

                    <ul className={"nav nav-pills flex-column"}>
                        {libraries.length === 0 ?
                            <li className={"nav-item"}>
                                <a href={"#"} className="nav-link text-muted">
                                    No libraries found
                                </a>
                            </li> : <></>}
                        {libraries.map(({urlId, name, collections}) =>
                            <Dropdown
                                key={urlId} toggler={name} targetId={"navbar-menu-" + urlId}
                                head={
                                    <Link href={"/library/" + urlId}>
                                        <a className={"nav-link"}>
                                            {name}
                                        </a>
                                    </Link>
                                }
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
                        <Dropdown
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
                        <Dropdown
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
                        <button role={"button"}
                                className={"btn btn-outline-" + (isLogin(session) ? "danger" : "success")}
                                onClick={() => {
                                    if (isLogin(session)) {
                                        signOut()
                                    } else {
                                        signIn("discord")
                                    }
                                }}>
                            {isLogin(session) ? <>
                                Sign out <FontAwesomeIcon icon={["fas", "sign-out-alt"]}/>
                            </> : <>
                                <FontAwesomeIcon icon={["fas", "sign-in-alt"]}/> Sign In
                            </>}
                        </button>
                    </div>
                </nav>
            </div>
        </div>
    </>
}

function adjustDragPosition({x = toggleButtonDragPadding, y = toggleButtonDragPadding}) {
    const dist = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))

    const snapPoints = [
        { // top left
            x: toggleButtonDragPadding,
            y: toggleButtonDragPadding
        },
        { // top right
            x: window.innerWidth - toggleButtonDragPadding - toggleButtonSize,
            y: toggleButtonDragPadding
        },
        { // bottom left
            x: toggleButtonDragPadding,
            y: window.innerHeight - toggleButtonDragPadding - toggleButtonSize
        },
        { // bottom right
            x: window.innerWidth - toggleButtonDragPadding - toggleButtonSize,
            y: window.innerHeight - toggleButtonDragPadding - toggleButtonSize
        }

    ]

    // ignore values on SSR/ISR
    if (typeof window !== "undefined") {
        const dists = snapPoints.map(p => dist({x, y}, p))
        return snapPoints[dists.indexOf(Math.min(...dists))]
    }

    return {x, y}
}
