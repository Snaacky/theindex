import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import styles from './Navbar.module.css'
import { useInViewport } from 'react-in-viewport'
import NavbarUser from './NavbarUser'
import NavbarBrand from './NavbarBrand'
import NavbarOutsideToggler from './NavbarOutsideToggler'
import Sidebar from './Sidebar'
import NavbarToggler from './NavbarToggler'
import IconItem from '../icons/IconItem'
import IconLibrary from '../icons/IconLibrary'
import IconCollection from '../icons/IconCollection'
import SupportBanner from '../alerts/SupportBanner'
import { canEdit } from '../../lib/session'
import { useSession } from 'next-auth/react'

export default function Navbar() {
  const [show, setShow] = useState(false)
  const { data: session } = useSession()

  const sidebarRef = useRef(null)
  const navbarToggleRef = useRef(null)
  const outsideToggleRef = useRef(null)

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If dropdown is open and the clicked target is not within the menu nor the toggle button itself
      if (
        show &&
        sidebarRef &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        navbarToggleRef &&
        navbarToggleRef.current &&
        !navbarToggleRef.current.contains(e.target) &&
        outsideToggleRef &&
        outsideToggleRef.current &&
        !outsideToggleRef.current.contains(e.target)
      ) {
        setShow(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)

    return () => {
      // Cleanup
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  })

  const { inViewport } = useInViewport(
    navbarToggleRef,
    {},
    {
      disconnectOnLeave: false,
    },
    {
      onEnterViewport: () => console.log('Entered viewport'),
    }
  )
  return (
    <>
      <div className={styles.outside}>
        <NavbarOutsideToggler
          show={show}
          inViewport={inViewport}
          onClick={() => setShow(!show)}
          ref={outsideToggleRef}
        />
      </div>

      <nav className={styles.navbar + ' navbar navbar-dark navbar-expand'}>
        <div className={'container-fluid'}>
          <NavbarToggler
            show={show}
            onClick={() => setShow(!show)}
            ref={navbarToggleRef}
            className={(!show ? styles.show : '') + ' me-2'}
          />
          <NavbarBrand />
          <div className={'collapse navbar-collapse me-2'}>
            <div className={'d-flex flex-row'}>
              <ul className={styles.listAll + ' nav nav-pills'}>
                <li className={'nav-item ms-2'}>
                  <Link href={'/libraries'}>
                    <a className={'nav-link umami--click--navbar-libraries'}>
                      <IconLibrary />
                      <span className={styles.listAllText + ' ms-1'}>
                        Libraries
                      </span>
                    </a>
                  </Link>
                </li>
                <li className={'nav-item ms-1'}>
                  <Link href={'/collections'}>
                    <a className={'nav-link umami--click--navbar-collections'}>
                      <IconCollection />
                      <span className={styles.listAllText + ' ms-1'}>
                        Collections
                      </span>
                    </a>
                  </Link>
                </li>
                {canEdit(session) && (
                  <li className={'nav-item ms-1'}>
                    <Link href={'/items'}>
                      <a className={'nav-link umami--click--navbar-items'}>
                        <IconItem />
                        <span className={styles.listAllText + ' ms-1'}>
                          Items
                        </span>
                      </a>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <div className={'ms-auto d-flex flex-row'}>
              <ul className={'nav nav-pills'}>
                <li className={styles.desktop + ' nav-item me-1'}>
                  <a
                    className={
                      'nav-link d-flex align-items-center umami--click--navbar-wiki'
                    }
                    href='https://wiki.piracy.moe/'
                    style={{ lineHeight: 1 }}
                  >
                    <Image
                      src={'/icons/wikijs.svg'}
                      height={24}
                      width={24}
                      alt={'Wiki.js logo'}
                    />
                    <span className={styles.services + ' ms-1'}>Wiki</span>
                  </a>
                </li>
                <span className={styles.listAll}>
                  <NavbarUser className={styles.username} />
                </span>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <SupportBanner />

      <Sidebar show={show} setShow={(v) => setShow(v)} ref={sidebarRef} />
    </>
  )
}
