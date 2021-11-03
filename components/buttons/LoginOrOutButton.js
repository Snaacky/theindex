import { isLogin } from '../../lib/session'
import { signIn, signOut, useSession } from 'next-auth/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function LoginOrOutButton() {
  const [session] = useSession()

  return (
    <button
      role={'button'}
      className={
        'btn w-100 btn-outline-' + (isLogin(session) ? 'danger' : 'success')
      }
      onClick={() => {
        if (isLogin(session)) {
          signOut()
        } else {
          signIn('discord')
        }
      }}
    >
      {isLogin(session) ? (
        <>
          Sign out <FontAwesomeIcon icon={['fas', 'sign-out-alt']} />
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={['fas', 'sign-in-alt']} /> Sign In
        </>
      )}
    </button>
  )
}
