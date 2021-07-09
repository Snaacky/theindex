import Head from 'next/head'
import {siteTitle} from "../layout/layout";
import ColumnFilter from "../column-filter";

export default function Table({table}) {
    return (
        <>
            <Head>
                <title>
                    {table.title + " | " + siteTitle}
                </title>
            </Head>

            <div className={"card bg-2"}>
                <div className="card-body">
                    <div className={"card-title d-flex justify-content-between"}
                         style={{
                             flexDirection: "row"
                         }}>
                        <span className="h3">
                            {table.title}
                        </span>
                        <div>
                            <button className={"btn btn-outline-primary"} type={"button"}
                                    data-bs-toggle={"collapse"} data-bs-target={"#collapseFilter-" + table.url_id}
                                    aria-expanded="false" aria-controls={"collapseFilter-" + table.url_id}>
                                Filter
                            </button>
                        </div>
                    </div>
                    <div id={"collapseFilter-" + table.url_id}
                         className="collapse row g-3">
                        <ColumnFilter columns={table.columns} onChange={console.log}/>
                    </div>
                </div>
            </div>
        </>
    )
}