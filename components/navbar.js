import Image from 'next/image'
import Link from 'next/link'

export default function Navbar({tabs}) {
    return <nav className="navbar navbar-expand-md navbar-dark bg-1">
        <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>

            <a className="navbar-brand" href="/">
                <Image src="/img/logo.png" alt="r/animepiracy Logo" width="32" height="32"
                       className="d-inline-block rounded align-text-top"/>
            </a>
            <div className="collapse navbar-collapse" id="navbarToggler">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    {
                        tabs.map(({id, title, tables}) => {
                            return <li className="nav-item dropdown">
                                <a className={"nav-link dropdown-toggle"} role="button"
                                   data-bs-toggle="dropdown" aria-expanded="false"
                                   id={"navDropdownLink-" + id}>
                                    {title}
                                </a>
                                <ul className="dropdown-menu" aria-labelledby={"navDropdownLink-" + id}>
                                    <li>
                                        <Link href={"/tab/" + id}>
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
                                            return <li>
                                                <Link href={"/tab/" + id + "/" + table.id}>
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
                    <input className="form-control me-2" type="search" placeholder="Search"
                           aria-label="Search"/>
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
        </div>
    </nav>
}