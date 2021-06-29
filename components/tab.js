import Head from 'next/head'
import {siteTitle} from "./layout";
import ColumnFilter from "./column-filter";

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
                        <ColumnFilter columns={columns} onChange={console.log}/>
                    </div>
                </div>
            </div>
        </>
    )
}