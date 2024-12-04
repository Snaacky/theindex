import { isLogin } from '../../lib/session'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import LoginOrOutButton from '../buttons/LoginOrOutButton'

export default function NavbarUser({ className }: { className?: string }) {
  const { data: session } = useSession()

  if (isLogin(session) && session !== null) {
    return (
      <>
        <li className={'nav-item'}>
          <Link
            href={'/user/' + session.user.uid}
            className={
              'nav-link d-flex align-items-center umami--click--navbar-profile'
            }
          >
            <Image
              src={session.user.image || '/img/puzzled.png'}
              width={24}
              height={24}
              className={'rounded-circle'}
              alt={session.user.name + "'s profile picture"}
            />
            <span className={className + ' ms-1'}>{session.user.name}</span>
          </Link>
        </li>
      </>
    )
  }

  return (
    <li className={'nav-item mx-2'}>
      <LoginOrOutButton />
    </li>
  )
}
