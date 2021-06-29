import Head from 'next/head'
import Link from 'next/link'
import {siteTitle} from "./layout";

export default function Tab({tab, columns}) {
    return (
        <>
            <Head>
                <title>
                    {tab.id + " | " + siteTitle}
                </title>
            </Head>

            <div className={"card"}>
                <div className="card-body">
                    <div className={"card-title d-flex justify-content-between"}
                         style={{
                             flexDirection: "row"
                         }}>
                        <span className="h3">
                            {tab.title}
                        </span>
                        <div>
                            <button className={"btn btn-outline-primary"} type={"button"}
                                    data-bs-toggle={"collapse"} data-bs-target={"#collapseFilter-" + tab.id}
                                    aria-expanded="false" aria-controls={"collapseFilter-" + tab.id}>
                                Filter
                            </button>
                        </div>
                    </div>
                    <div id={"collapseFilter-" + tab.id}
                         className="collapse row g-3">
                        {columns.map(({id, title, description, type, values}) => {
                            if (type === "bool") {
                                return (
                                    <div className="col">
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox"
                                                   aria-describedby={"switch-" + tab.id + "Filter-" + id + "Help"}
                                                   id={"switch-" + tab.id + "Filter-" + id}/>
                                            <label className="form-check-label"
                                                   htmlFor={"switch-" + tab.id + "Filter-" + id}>
                                                {title}
                                            </label>
                                        </div>
                                        <div id={"switch-" + tab.id + "Filter-" + id + "Help"} className="form-text">
                                            {description}
                                        </div>
                                    </div>
                                )
                            } else if (type === "array") {
                                return (
                                    <div className="col">
                                        <div className="form-floating">
                                            <input type="text" className="form-control" placeholder={title}
                                                   id={"array-" + tab.id + "Filter-" + id}
                                                   list={"datalist-" + tab.id + "Filter-" + id}/>
                                            <label htmlFor="floatingInput">
                                                {title}
                                            </label>
                                            <datalist id={"datalist-" + tab.id + "Filter-" + id}>
                                                {
                                                    values.map(v => <option value={v}>{v}</option>)
                                                }
                                            </datalist>
                                        </div>
                                        <div id={"switch-" + tab.id + "Filter-" + id + "Help"} className="form-text">
                                            {description}
                                        </div>
                                    </div>
                                )
                            }
                            return (
                                <div className="col">
                                    <div className={"card"}>
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                <Link href={"/table/" + id}>
                                                    {title}
                                                </Link>
                                            </h5>
                                            <p>
                                                {description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}