import { isLogin } from '../../lib/session'
import { signIn, signOut, useSession } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt'

const LoginOrOutButton: FC = () => {
  const { data: session } = useSession()

  if (isLogin(session)) {
    return (
      <button
        type='button'
        className={'btn w-100 btn-outline-danger'}
        onClick={async () => {
          await signOut()
        }}
      >
        Sign out <FontAwesomeIcon icon={faSignOutAlt} />
      </button>
    )
  }

  return (
    <button
      type='button'
      className={'btn w-100 btn-outline-success'}
      onClick={async () => {
        await signIn('discord')
      }}
    >
      <FontAwesomeIcon icon={faSignInAlt} /> Sign In
    </button>
  )
}

export default LoginOrOutButton
