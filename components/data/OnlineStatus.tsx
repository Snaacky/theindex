import { FC, useState } from 'react'
import styles from './OnlineStatus.module.css'
import OnlineStatusModal from '../modals/OnlineStatusModal'
import { useItemStatus } from '../../lib/itemStatusClient'

// import types
import { StatusData, Statuses } from '../../types/OnlineStatus'
import { Item } from '../../types/Item'

type Props = {
  item: Item
  initialStatus?: StatusData | null
}

const OnlineStatus: FC<Props> = ({ item, initialStatus = null }) => {
  const data = useItemStatus(item._id, initialStatus)
  const [show, setShow] = useState(false)

  let style = '',
    text = ''
  if (!data || data.status === 'fetching') {
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
  } else if (data.status === 'noURL') {
    style = styles.down
    text = Statuses.noURL
  }

  style = styles.status + ' ' + style
  let time = 'never'
  if (data && data.time !== '0') {
    time = new Date(parseInt(data.time)).toLocaleTimeString()
  }

  return (
    <>
      <span
        className={style}
        onClick={() => setShow(true)}
        data-tooltip-content={
          text + (data && item.name ? ', last checked ' + time : '')
        }
      />
      {show && (
        <OnlineStatusModal
          url={item.urls[0]}
          style={style}
          text={text}
          data={data}
          close={() => setShow(false)}
        />
      )}
    </>
  )
}

export default OnlineStatus
