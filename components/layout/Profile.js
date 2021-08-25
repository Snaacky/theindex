import Image from "next/image"
import Link from "next/link"
import {signIn, signOut, useSession} from "next-auth/client"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export default function Profile() {
    const [session] = useSession()

    return <li className="nav-item dropdown">
        <a className={"nav-link dropdown-toggle profile"} role="button"
           data-bs-toggle="dropdown" aria-expanded="false"
           id={"userNavDropdownLink"}>
            {session ?
                <div className={"d-flex"}>
                    <Image src={session.user.image} width={21} height={21}
                           className={"rounded-circle"} alt={"Discord profile picture"}/>
                </div>
                : <FontAwesomeIcon icon={["fas", "user-circle"]}/>}
        </a>
        <ul className="dropdown-menu dropdown-menu-end bg-4" aria-labelledby={"userNavDropdownLink"}>
            {session ?
                <>
                    <li>
                        <Link href={"/user/" + session.user.id}>
                            <a className="dropdown-item">
                                <FontAwesomeIcon icon={["fas", "user-circle"]}/> {session.user.name}
                            </a>
                        </Link>
                    </li>
                    <hr className="dropdown-divider"/>
                </>
                : <></>}
            <li>
                <a className="dropdown-item" onClick={() => {
                    if (session) {
                        signOut()
                    } else {
                        signIn("discord")
                    }
                }} style={{cursor: "pointer"}}>
                    {session ? <>
                        Sign out <FontAwesomeIcon icon={["fas", "sign-out-alt"]} className={"text-danger"}/>
                    </> : <>
                        <FontAwesomeIcon icon={["fas", "sign-in-alt"]} className={"text-success"}/> Sign In
                    </>}
                </a>
            </li>
        </ul>
    </li>
}