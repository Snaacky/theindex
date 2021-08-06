import Image from "next/image"
import Link from "next/link"
import Profile from "./profile";
import {useSession} from "next-auth/client"
import IconAdd from "../icons/IconAdd";
import {canEdit} from "../../lib/session";
import IconAdmin from "../icons/IconAdmin";
import IconTable from "../icons/IconTable";
import IconTab from "../icons/IconTab";
import IconItem from "../icons/IconItem";
import IconColumn from "../icons/IconColumn";

export default function Navbar({tabs}) {
    const [session] = useSession()

    return <nav className="navbar navbar-expand-md navbar-dark bg-2">
        <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>

            <Link href={"/"}>
                <a className="navbar-brand pb-0">
                    <Image src="/img/logo.png" alt="r/animepiracy Logo" width="32" height="32"
                           className="d-inline-block rounded align-top"/>
                    <span className={"ms-2 d-sm-inline-block d-none align-top"}>
                        /r/animepiracy Index
                    </span>
                </a>
            </Link>
            <div className="collapse navbar-collapse" id="navbarToggler">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    {
                        tabs.map(({urlId, title, tables}) => {
                            return <li className="nav-item dropdown" key={urlId}>
                                <a className={"nav-link dropdown-toggle"} role="button"
                                   data-bs-toggle="dropdown" aria-expanded="false"
                                   id={"navDropdownLink-" + urlId}>
                                    {title}
                                </a>
                                <ul className="dropdown-menu bg-4" aria-labelledby={"navDropdownLink-" + urlId}>
                                    <li>
                                        <Link href={"/tab/" + urlId}>
                                            <a className="dropdown-item">
                                                {title}
                                            </a>
                                        </Link>
                                    </li>
                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>
                                    {
                                        tables.map((table) => {
                                            return <li key={table.urlId}>
                                                <Link href={"/table/" + table.urlId}>
                                                    <a className="dropdown-item">
                                                        {table.title}
                                                    </a>
                                                </Link>
                                            </li>
                                        })
                                    }
                                </ul>
                            </li>
                        })
                    }
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
                        {canEdit(session) ? <li className="nav-item dropdown">
                            <a className={"nav-link dropdown-toggle"} role="button"
                               data-bs-toggle="dropdown" aria-expanded="false"
                               id={"navDropdownLinkAdmin"}>
                                <IconAdmin/> Admin
                            </a>
                            <ul className="dropdown-menu bg-4" aria-labelledby={"navDropdownLinkAdmin"}>
                                <li>
                                    <Link href={"/admin"}>
                                        <a className={"dropdown-item"} title={"Admin settings"}>
                                            <IconAdmin/> Admin
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <hr className="dropdown-divider"/>
                                </li>
                                <li>
                                    <Link href={"/edit/tabs"}>
                                        <a className="dropdown-item">
                                            <IconTab/> Tabs
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/edit/tables"}>
                                        <a className="dropdown-item">
                                            <IconTable/> Tables
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/edit/columns"}>
                                        <a className="dropdown-item">
                                            <IconColumn/> Columns
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/edit/items"}>
                                        <a className="dropdown-item">
                                            <IconItem/> Items
                                        </a>
                                    </Link>
                                </li>
                            </ul>
                        </li> : <></>
                        }
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
                                     src={"/icons/uptimerobot.png"} alt={"UptimeRobot logo"}/>
                                Status
                            </a>
                        </li>
                        <Profile/>
                    </ul>
                </form>
            </div>
        </div>
    </nav>
}
