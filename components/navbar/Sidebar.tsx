import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Navbar.module.css'
import NavbarBrand from './NavbarBrand'
import NavbarUser from './NavbarUser'
import NavbarDropdown from './NavbarDropdown'
import IconLibrary from '../icons/IconLibrary'
import IconCollection from '../icons/IconCollection'
import IconColumn from '../icons/IconColumn'
import IconItem from '../icons/IconItem'
import IconList from '../icons/IconList'
import LoginOrOutButton from '../buttons/LoginOrOutButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useSWR from 'swr'
import NavbarToggler from './NavbarToggler'
import { isAdmin, isLogin } from '../../lib/session'
import { useSession } from 'next-auth/react'
import IconAdmin from '../icons/IconAdmin'
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers'
import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord'

function Sidebar({ show, setShow }, ref) {
  const { data: session } = useSession()
  const { data: swrLibraries } = useSWR('/api/libraries', { fallbackData: [] })
  const { data: swrCollections } = useSWR('/api/collections', {
    fallbackData: [],
  })
  const libraries = swrLibraries || []
  const allCollections = swrCollections || []

  const clickFunc = () => setShow(!show)

  return (
    <div
      className={
        styles.sidebar + ' offcanvas offcanvas-start fade' + (show && ' show')
      }
      ref={ref}
      id={'navbarOffcanvas'}
      tabIndex={-1}
      aria-hidden={!show}
      role={'dialog'}
    >
      <div className={styles.header + ' offcanvas-header'}>
        <div className={'container-fluid d-flex flex-row align-items-center'}>
          <NavbarToggler show={show} onClick={clickFunc} />

          <div onClick={clickFunc} className={'ms-2'}>
            <NavbarBrand />
          </div>
        </div>
      </div>

      <div className='offcanvas-body'>
        <nav role={'navigation'}>
          {isLogin(session) && (
            <>
              <ul className={'nav nav-pills flex-column'} onClick={clickFunc}>
                <NavbarUser />
                {isAdmin(session) && (
                  <>
                    <li className={'nav-item'}>
                      <Link href={'/admin/users'} className={'nav-link'}>
                        <FontAwesomeIcon icon={faUsers} /> Users
                      </Link>
                    </li>
                    <li className={'nav-item'}>
                      <Link
                        href={'/admin'}
                        className={'nav-link'}
                        data-tooltip-content={'Admin settings'}
                      >
                        <IconAdmin /> Admin
                      </Link>
                    </li>
                  </>
                )}
              </ul>
              <hr />
            </>
          )}

          <ul className={'nav nav-pills flex-column'}>
            {libraries.length === 0 && (
              <li className={'nav-item'}>
                <Link href={'#'} className='nav-link'>
                  No libraries found
                </Link>
              </li>
            )}
            {libraries.map(({ urlId, name, collections }) => (
              <NavbarDropdown
                key={urlId}
                toggler={name}
                targetId={'navbar-menu-' + urlId}
                viewAllUrl={'/library/' + urlId}
                contentList={
                  collections.length === 0
                    ? [
                        <Link
                          href={'#'}
                          className={'nav-link'}
                          key={'noCollectionsFound'}
                        >
                          No collections found
                        </Link>,
                      ]
                    : collections.map((collection) => {
                        collection = allCollections.find(
                          (c) => c._id === collection
                        )
                        if (collection) {
                          return (
                            <Link
                              href={'/collection/' + collection.urlId}
                              key={collection.urlId}
                              className={
                                'nav-link umami--click--collection-' +
                                collection.name
                              }
                            >
                              {collection.name}
                            </Link>
                          )
                        }
                        return <></>
                      })
                }
                onClick={() => clickFunc()}
              />
            ))}
          </ul>

          <hr />
          <ul className={'nav nav-pills flex-column'} onClick={clickFunc}>
            <li className={'nav-item'}>
              <Link
                href={'/libraries'}
                className={'nav-link umami--click--navbar-libraries'}
              >
                <IconLibrary /> Libraries
              </Link>
            </li>
            <li className={'nav-item'}>
              <Link
                href={'/collections'}
                className={'nav-link umami--click--navbar-collections'}
              >
                <IconCollection /> Collections
              </Link>
            </li>
            <li className={'nav-item'}>
              <Link
                href={'/columns'}
                className={'nav-link umami--click--navbar-columns'}
              >
                <IconColumn /> Columns
              </Link>
            </li>
            <li className={'nav-item'}>
              <Link
                href={'/items'}
                className={'nav-link umami--click--navbar-items'}
              >
                <IconItem /> Items
              </Link>
            </li>
            <li className={'nav-item'}>
              <Link
                href={'/lists'}
                className={'nav-link umami--click--navbar-lists'}
              >
                <IconList /> User lists
              </Link>
            </li>
          </ul>

          <hr />
          <ul className={'nav nav-pills flex-column'}>
            <NavbarDropdown
              toggler={'Other services'}
              targetId={'navbar-menu-services'}
              contentList={[
                <Link
                  className={
                    'nav-link d-flex align-items-center umami--click--navbar-wiki'
                  }
                  href='https://thewiki.moe/'
                  key={'wiki'}
                >
                  <Image
                    src={'/icons/wikijs.svg'}
                    height={16}
                    width={16}
                    alt={'Wiki.js logo'}
                  />
                  <span className={'ms-1'}>Wiki</span>
                </Link>,
              ]}
              onClick={() => clickFunc()}
            />
            <NavbarDropdown
              toggler={'Social media'}
              targetId={'navbar-menu-social-media'}
              contentList={[
                <Link
                  className={'nav-link umami--click--navbar-discord'}
                  href={'https://discord.gg/snackbox'}
                  key={'discord'}
                  target={'_blank'}
                  rel='noreferrer'
                >
                  <FontAwesomeIcon icon={faDiscord} /> Discord
                </Link>,
              ]}
              onClick={() => clickFunc()}
            />
          </ul>

          <hr />
          <div className={'d-flex justify-content-center'}>
            <LoginOrOutButton />
          </div>
        </nav>
      </div>
    </div>
  )
}

export default React.forwardRef(Sidebar)
