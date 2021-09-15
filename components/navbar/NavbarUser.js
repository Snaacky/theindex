import {isLogin} from "../../lib/session"
import {useSession} from "next-auth/client"
import Link from "next/link"
import Image from "next/image"
import LoginOrOutButton from "../buttons/LoginOrOutButton"

export default function NavbarUser({className}) {
    const [session] = useSession()

    if (isLogin(session)) {
        return <>
            <li className={"nav-item"}>
                <Link href={"/user/" + session.user.uid}>
                    <a className={"nav-link"}>
                        <Image src={session.user.image || "/img/puzzled.png"} width={16} height={16}
                               className={"rounded-circle"} alt={session.user.name + "'s profile picture"}/>
                        <span className={className + " ms-1"}>
                            {session.user.name}
                        </span>
                    </a>
                </Link>
            </li>
        </>
    }

    return <li className={"nav-item mx-2"}>
        <LoginOrOutButton/>
    </li>
}
