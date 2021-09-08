import Image from "next/image"
import Link from "next/link"

export default function NavbarBrand() {
    return <Link href={"/"}>
        <a className={"navbar-brand d-block"}>
            <Image src="/icons/logo.png" alt="r/animepiracy Logo" width="32" height="32"
                   className="d-inline-block rounded align-top"/>
            <span className={"ms-2 align-top"}>
                The Anime Index
            </span>
        </a>
    </Link>
}
