import Modal from './Modal'
import { signIn } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt'

type Props = {
  text: string
  close: () => void
}

const LoginModal: FC<Props> = ({ text, close }) => {
  return (
    <Modal
      close={close}
      head={'Login required'}
      footer={
        <button className={'btn btn-outline-success'} onClick={() => signIn()}>
          <FontAwesomeIcon icon={faSignInAlt} /> Sign In
        </button>
      }
    >
      <p>To use this feature you need to login first</p>
      <kbd>
        <code>{text}</code>
      </kbd>
    </Modal>
  )
}

export default LoginModal
