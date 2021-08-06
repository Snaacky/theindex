import styles from "./Login.module.css"
import {signIn} from "next-auth/client"
import {Icon} from "react-icons-kit"
import {signIn as iconSignIn} from "react-icons-kit/fa/signIn"
import Head from "next/head"

export default function Login() {
    return <div className={styles.wrapper}>
        <Head>
            <title>
                Access denied
            </title>
            <meta name="robots" content="noindex" />
        </Head>
        <h3 className={"mb-3"}>
            This page is protected
        </h3>
        <button className={"btn btn-outline-success"} onClick={signIn}>
            <Icon icon={iconSignIn}/> Sign In
        </button>
    </div>
}
