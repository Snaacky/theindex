import Image from "next/image"
import {useEffect, useRef, useState} from "react"
import styles from "./Navbar.module.css"
import {useInViewport} from 'react-in-viewport'
import NavbarUser from "./NavbarUser"
import NavbarBrand from "./NavbarBrand"
import NavbarOutsideToggler from "./NavbarOutsideToggler"
import Sidebar from "./Sidebar"
import NavbarToggler from "./NavbarToggler";

export default function Navbar() {
    const [show, setShow] = useState(false)

    const sidebarRef = useRef()
    const navbarToggleRef = useRef()
    const outsideToggleRef = useRef()

    useEffect(() => {
        const checkIfClickedOutside = e => {
            console.log("Refs are:")
            console.log("sidebarRef", sidebarRef)
            console.log("navbarToggleRef", navbarToggleRef)
            console.log("outsideToggleRef", outsideToggleRef)

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

        <div className={styles.navbar}>
            <div className={styles.header + " offcanvas-header"}>
                <div className={"d-flex flex-row justify-content-center"}>
                    <NavbarBrand/>
                </div>

                <div className={"d-flex flex-row"}>
                    <ul className={styles.desktop + " nav nav-pills"}>
                        <li className={"nav-item"}>
                            <a className={"nav-link"} href="https://wiki.piracy.moe/" key={"wiki"}>
                                <Image src={"/icons/wikijs.svg"} height={16} width={16}
                                       alt={"Wiki.js logo"}/>
                                <span className={"ms-1"}>
                                    Wiki
                                </span>
                            </a>
                        </li>
                        <li className={"nav-item"}>
                            <a className={"nav-link"} href="https://status.piracy.moe/" key={"status"}>
                                <Image src={"/icons/status.png"} height={16} width={16}
                                       alt={"Checkly logo"}/>
                                <span className={"ms-1"}>
                                    Status
                                </span>
                            </a>
                        </li>
                        <li className={"nav-item"}>
                            <a className={"nav-link"} href="https://releases.moe/" key={"seadex"}>
                                <Image src={"/icons/seadex.png"} height={16} width={16}
                                       alt={"Seadex logo"}/>
                                <span className={"ms-1"}>
                                    SeaDex
                                </span>
                            </a>
                        </li>
                        <NavbarUser/>
                    </ul>
                    <NavbarToggler show={show} onClick={() => setShow(!show)} ref={navbarToggleRef}
                                   className={"ms-2 " + (!show ? styles.show : "")}/>
                </div>
            </div>
        </div>

        <Sidebar show={show} setShow={(v) => setShow(v)} ref={sidebarRef}/>
    </>
}
