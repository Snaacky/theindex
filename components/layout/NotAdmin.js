import styles from "./NotLogin.module.css"
import Link from "next/link"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Head from "next/head"
import Image from "next/image"

export default function NotAdmin() {
    return <div className={styles.wrapper}>
        <Head>
            <title>
                Access denied
            </title>
            <meta name="robots" content="noindex"/>
            <meta name={"description"} content={"You are missing privileges to view the site"}/>
        </Head>
        <h3 className={"mt-5 mb-3"}>
            This page is protected
        </h3>

        <Image width={128} height={128} src={"/img/TsumikiNyan.gif"} alt={""}
               className={"rounded"}/>
        <p>
            You do not seem to have enough rights to access this page
        </p>
        <Link href={"/"}>
            <a className={"btn btn-outline-success"} title={"Go back"}>
                <FontAwesomeIcon icon={["fas", "sign-in-alt"]}/> Home
            </a>
        </Link>
    </div>
}
