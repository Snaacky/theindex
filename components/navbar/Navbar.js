import Image from "next/image"
import Link from "next/link"
import {useEffect, useRef, useState} from "react"
import styles from "./Navbar.module.css"
import {useInViewport} from 'react-in-viewport'
import NavbarUser from "./NavbarUser"
import NavbarBrand from "./NavbarBrand"
import NavbarOutsideToggler from "./NavbarOutsideToggler"
import Sidebar from "./Sidebar"
import NavbarToggler from "./NavbarToggler"
import IconItem from "../icons/IconItem"
import IconLibrary from "../icons/IconLibrary"
import IconCollection from "../icons/IconCollection"

export default function Navbar() {
    const [show, setShow] = useState(false)

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

        document.addEventListener("mousedown", checkIfClickedOutside)

        return () => {
            // Cleanup
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }
    })

    const {inViewport} = useInViewport(navbarToggleRef, {}, {
        disconnectOnLeave: false
    }, {
        onEnterViewport: () => console.log("Entered viewport")
    })
    return <>
        <div className={styles.outside}>
            <NavbarOutsideToggler show={show} inViewport={inViewport} onClick={() => setShow(!show)}
                                  ref={outsideToggleRef}/>
        </div>

        <nav className={styles.navbar + " navbar navbar-dark navbar-expand"}>
            <div className={"container-fluid"}>
                <NavbarBrand/>
                <div className={"collapse navbar-collapse me-2"}>
                    <div className={"d-flex flex-row"}>
                        <ul className={styles.listAll + " nav nav-pills"}>
                            <li className={"nav-item ms-2"}>
                                <Link href={"/libraries"}>
                                    <a className={"nav-link"}>
                                        <IconLibrary/>
                                        <span className={styles.listAllText + " ms-1"}>
                                            Libraries
                                        </span>
                                    </a>
                                </Link>
                            </li>
                            <li className={"nav-item ms-1"}>
                                <Link href={"/collections"}>
                                    <a className={"nav-link"}>
                                        <IconCollection/>
                                        <span className={styles.listAllText + " ms-1"}>
                                            Collections
                                        </span>
                                    </a>
                                </Link>
                            </li>
                            <li className={"nav-item ms-1"}>
                                <Link href={"/items"}>
                                    <a className={"nav-link"}>
                                        <IconItem/>
                                        <span className={styles.listAllText + " ms-1"}>
                                            Items
                                        </span>
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className={"ms-auto d-flex flex-row"}>
                        <ul className={"nav nav-pills"}>
                            <li className={styles.desktop + " nav-item me-1"}>
                                <a className={"nav-link"} href="https://wiki.piracy.moe/">
                                    <Image src={"/icons/wikijs.svg"} height={16} width={16}
                                           alt={"Wiki.js logo"}/>
                                    <span className={styles.services + " ms-1"}>
                                        Wiki
                                    </span>
                                </a>
                            </li>
                            <li className={styles.desktop + " nav-item me-1"}>
                                <a className={"nav-link"} href="https://status.piracy.moe/">
                                    <Image src={"/icons/status.png"} height={16} width={16}
                                           alt={"Checkly logo"}/>
                                    <span className={styles.services + " ms-1"}>
                                        Status
                                    </span>
                                </a>
                            </li>
                            <li className={styles.desktop + " nav-item me-1"}>
                                <a className={"nav-link"} href="https://releases.moe/">
                                    <Image src={"/icons/seadex.png"} height={16} width={16}
                                           alt={"Seadex logo"}/>
                                    <span className={styles.services + " ms-1"}>
                                        SeaDex
                                    </span>
                                </a>
                            </li>
                            <span className={styles.listAll}>
                                <NavbarUser className={styles.username}/>
                            </span>
                        </ul>
                        <NavbarToggler show={show} onClick={() => setShow(!show)} ref={navbarToggleRef}
                                       className={(!show ? styles.show : "") + " ms-2"}/>
                    </div>
                </div>
            </div>
        </nav>

        <Sidebar show={show} setShow={(v) => setShow(v)} ref={sidebarRef}/>
    </>
}
