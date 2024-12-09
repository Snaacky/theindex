import { isLogin } from '../../lib/session'
import { useSession } from 'next-auth/react'
import { signIn, signOut } from '../../auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt'

const LoginOrOutButton: FC = () => {
  const { data: session } = useSession()

  if (isLogin(session)) {
    return (
      <form
        action={async () => {
          'use server'
          await signOut()
        }}
      >
        <button type='submit' className={'btn w-100 btn-outline-danger'}>
          Sign out <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </form>
    )
  }

  return (
    <form
      action={async () => {
        'use server'
        await signIn('discord')
      }}
    >
      <button type='submit' className={'btn w-100 btn-outline-success'}>
        <FontAwesomeIcon icon={faSignInAlt} /> Sign In
      </button>
    </form>
  )
}

export default LoginOrOutButton
