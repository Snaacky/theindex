import {useRouter} from "next/router"
import Loader from "../../components/loading";
import Error from "../_error";
import {getError} from "../../lib/error";

export default function ErrorPage({status, error}) {
    const router = useRouter()

    if (router.isFallback) {
        return <Loader/>
    }

    return <Error statusCode={status} error={error}/>
}

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: "blocking",
    }
}

export async function getStaticProps({params}) {
    const status = params.id
    const error = getError(status)
    return {
        props: {status, error},
        revalidate: 60
    };
}
