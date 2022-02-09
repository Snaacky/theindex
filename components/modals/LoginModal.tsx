import Modal from './Modal'
import { signIn } from 'next-auth/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'

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
          <FontAwesomeIcon icon={['fas', 'sign-in-alt']} /> Sign In
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
