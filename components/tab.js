import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import {siteTitle} from "./layout";

export default function Tab({tab}) {
    return (
        <>
            <Head>
                <title>
                    {tab.title + " | " + siteTitle}
                </title>
            </Head>

            <div className={"card bg-2 mb-3"}>
                <div className="card-body">
                    <div className={"card-title"}>
                        <h2>
                            {tab.title}
                        </h2>
                    </div>
                    <p className={"card-text"}>
                        {tab.description}
                    </p>
                </div>
            </div>

            {tab.tables.map(t => {
                return <div className={"card bg-2 mb-2 me-2"} style={{
                    maxWidth: 540
                }}>
                    <div className="row g-0">
                        <div className="col-auto p-1">
                            <Image src={t.img ? t.img : "/img/puzzled.png"} className="img-fluid rounded-start"
                                   alt="..." width={128} height={128}/>
                        </div>
                        <div className="col">
                            <div className={"card-body"}>
                                <h5 className={"card-title"}>
                                    {t.title}
                                </h5>

                                <p className={"card-text"}>
                                    {t.description}
                                </p>
                                <Link href={"/tables/" + t.url_id}>
                                    <a className={"btn btn-primary"}>
                                        Take a look
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            })}
        </>
    )
}
