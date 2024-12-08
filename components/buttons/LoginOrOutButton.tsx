import { isLogin } from '../../lib/session'
import { signIn, signOut, useSession } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt'

const LoginOrOutButton: FC = () => {
  const { data: session } = useSession()

  return (
    <form
      action={async () => {
        'use server'
        if (isLogin(session)) {
          await signOut()
        } else {
          await signIn('discord')
        }
      }}
    >
      <button
        type='submit'
        className={
          'btn w-100 btn-outline-' + (isLogin(session) ? 'danger' : 'success')
        }
      >
        {isLogin(session) ? (
          <>
            Sign out <FontAwesomeIcon icon={faSignOutAlt} />
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faSignInAlt} /> Sign In
          </>
        )}
      </button>
    </form>
  )
}

export default LoginOrOutButton
