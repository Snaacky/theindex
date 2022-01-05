import useSWR from 'swr'
import { FC, useState } from 'react'
import styles from './OnlineStatus.module.css'
import OnlineStatusModal from '../modals/OnlineStatusModal'
import axios from 'axios'

// import types
import { Statuses, StatusData } from '../../types/OnlineStatus'

type Props = {
  url: string
}

const OnlineStatus: FC<Props> = ({ url }) => {
  let { data, error } = useSWR<StatusData>(url, (u: string) =>
    axios
      .post<StatusData>('https://ping.piracy.moe/ping', {
        url: u,
      })
      .then((res) => res.data)
  )

  const [show, setShow] = useState(false)

  let style = '',
    text = ''
  if (error) {
    style = styles.error
    text = error.toString()
  } else if (!url) {
    style = styles.down
    text = Statuses.noURL
  } else {
    if (!data) {
      style = styles.ping
      text = Statuses.fetching
    } else if (data.status === 'down') {
      style = styles.down
      text = Statuses.down
    } else if (data.status === 'up') {
      style = styles.up
      text = Statuses.up
    } else if (data.status === 'unknown') {
      style = styles.unknown
      text = Statuses.unknown
    }
  }

  style = styles.status + ' ' + style
  return (
    <>
      <span
        className={style}
        onClick={() => setShow(true)}
        data-tip={
          text +
          (data && url
            ? ', last checked ' +
              new Date(parseInt(data.time) * 1000).toLocaleTimeString()
            : '')
        }
      />
      {show ? (
        <OnlineStatusModal
          url={url}
          style={style}
          text={text}
          data={data}
          close={() => setShow(false)}
        />
      ) : (
        <></>
      )}
    </>
  )
}

export default OnlineStatus
