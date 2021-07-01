import Image from 'next/image'
import Link from 'next/link'

export default function Navbar({tabs}) {
    return <nav className="navbar navbar-expand-md navbar-dark bg-2">
        <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>

            <Link href={"/"}>
                <a className="navbar-brand">
                    <Image src="/img/logo.png" alt="r/animepiracy Logo" width="32" height="32"
                           className="d-inline-block rounded align-text-top"/>
                </a>
            </Link>
            <div className="collapse navbar-collapse" id="navbarToggler">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    {
                        tabs.map(({url_id, title, tables}) => {
                            return <li className="nav-item dropdown" key={url_id}>
                                <a className={"nav-link dropdown-toggle"} role="button"
                                   data-bs-toggle="dropdown" aria-expanded="false"
                                   id={"navDropdownLink-" + url_id}>
                                    {title}
                                </a>
                                <ul className="dropdown-menu bg-4" aria-labelledby={"navDropdownLink-" + url_id}>
                                    <li>
                                        <Link href={"/tab/" + url_id}>
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
                                            return <li key={table.url_id}>
                                                <Link href={"/table/" + table.url_id}>
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
                </ul>
                <form className="d-flex">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="https://wiki.piracy.moe/">Wiki</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="https://status.piracy.moe/">Status</a>
                        </li>
                    </ul>
                </form>
            </div>
        </div>
    </nav>
}