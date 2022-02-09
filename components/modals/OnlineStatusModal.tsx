import Modal from './Modal'
import styles from '../data/OnlineStatus.module.css'

// import types
import { StatusData, Statuses } from '../../types/OnlineStatus'
import { FC } from 'react'

type Props = {
  style: string
  text: string
  url: string
  data: StatusData
  close: () => void
}

const OnlineStatusModal: FC<Props> = ({ style, text, url, data, close }) => {
  let pingStyle = styles.status + ' '

  return (
    <Modal
      close={close}
      head={
        url ? (
          <>
            Online status of <kbd className={'text-primary'}>{url}</kbd>
          </>
        ) : (
          'No url provided to check anything'
        )
      }
      footer={
        data &&
        data.time && (
          <span className={'text-muted'}>
            Checked at{' '}
            <kbd>
              <code>
                {new Date(parseInt(data.time) * 1000).toLocaleTimeString()}
              </code>
            </kbd>
          </span>
        )
      }
    >
      <div className={'container-fluid'}>
        <div className={'mb-2'}>
          <span className={'me-2'}>Result:</span>
          <div className={style} />
          <kbd>{text}</kbd>
        </div>
        <div className={'mt-3'}>
          <h4>Possible states are:</h4>
          <ul className={'list-unstyled'}>
            <li>
              <div className={pingStyle + styles.up} />
              {Statuses.up}
            </li>
            <li>
              <div className={pingStyle + styles.unknown} />
              {Statuses.unknown}
            </li>
            <li>
              <div className={pingStyle + styles.down} />
              {Statuses.down}
            </li>
            <li>
              <div className={pingStyle + styles.error} />
              {Statuses.error}
            </li>
            <li>
              <div className={pingStyle + styles.ping} />
              {Statuses.ping}
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  )
}

export default OnlineStatusModal
