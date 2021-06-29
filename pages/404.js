import Layout from "../components/layout";
import Image from 'next/image'

export default function Custom404() {
    return <Layout error={404}>
        <div className={"position-absolute top-50 start-50 translate-middle"}>
            <div className={"d-flex justify-content-center"}>
                <Image src={"/img/NoPls.gif"} alt={"Desperate Yui"}
                       width={120} height={120}/>
            </div>
            <h1>
                We couldn't find the site you were searching for
            </h1>
        </div>
    </Layout>
}