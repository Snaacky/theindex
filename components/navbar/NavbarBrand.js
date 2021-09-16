import Image from "next/image"
import Link from "next/link"

export default function NavbarBrand() {
    return <Link href={"/"}>
        <a className={"navbar-brand d-block"}>
            <Image src="/icons/logo.png" alt="r/animepiracy Logo" width="32" height="32"
                   className="d-inline-block rounded align-top"/>
            <span className={"ms-2 align-top position-relative"}>
                {process.env.NEXT_PUBLIC_SITE_NAME}
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary"
                      style={{
                          fontSize: "0.7rem"
                      }}>
                    Beta
                </span>
            </span>
        </a>
    </Link>
}
