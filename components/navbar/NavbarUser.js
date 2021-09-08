import {isAdmin, isLogin} from "../../lib/session"
import {useSession} from "next-auth/client"
import IconAdmin from "../icons/IconAdmin"
import Link from "next/link"
import Image from "next/image"
import LoginOrOutButton from "../buttons/LoginOrOutButton"

export default function NavbarUser() {
    const [session] = useSession()

    if (isLogin(session)) {
        return <>
            <li className={"nav-item"}>
                <Link href={"/user/" + session.user.uid}>
                    <a className={"nav-link"}>
                        <Image src={session.user.image} width={16} height={16}
                               className={"rounded-circle"}
                               alt={session.user.name + "'s profile picture"}/>
                        <span className={"ms-2"}>
                                            {session.user.name}
                                        </span>
                    </a>
                </Link>
            </li>
            {isAdmin(session) ?
                <li className={"nav-item"}>
                    <Link href={"/admin"}>
                        <a className={"nav-link"} title={"Admin settings"}>
                            <IconAdmin/> Admin
                        </a>
                    </Link>
                </li> : <></>
            }
        </>
    }

    return <li className={"nav-item"}>
        <LoginOrOutButton/>
    </li>
}
