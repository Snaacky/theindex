import Layout from "../components/layout/Layout"
import Image from "next/image"
import {getError} from "../lib/error"

export default function Error({statusCode, error}) {
    const text = error.message ?? error.text ?? error
    return <Layout error={statusCode}>
        <div className={"position-absolute top-50 start-50 translate-middle"}>
            <div className={"d-flex justify-content-center"}>
                <Image src={error.img} alt={error.imgAlt}
                       width={120} height={120}/>
            </div>
            <h1 className={"mb-4"}>
                {text.toString()}
            </h1>
            <div className={"d-flex justify-content-center"}>
                <a href={"/"} className={"btn btn-outline-warning"}>
                    Go back
                </a>
            </div>
        </div>
    </Layout>
}

export async function getStaticProps({res, err}) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    const error = getError(statusCode)
    return {
        props: {
            statusCode,
            error
        }
    }
}
