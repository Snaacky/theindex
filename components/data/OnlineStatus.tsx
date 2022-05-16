import useSWR from 'swr'
import { FC, useState } from 'react'
import styles from './OnlineStatus.module.css'
import OnlineStatusModal from '../modals/OnlineStatusModal'

// import types
import { StatusData, Statuses } from '../../types/OnlineStatus'
import { Item } from '../../types/Item'

type Props = {
  item: Item
}

const OnlineStatus: FC<Props> = ({ item }) => {
  let { data, error } = useSWR<StatusData>('/api/item/ping/' + item._id)

  const [show, setShow] = useState(false)

  let style = '',
    text = ''
  if (error) {
    style = styles.error
    text = error.toString()
  } else {
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
  }

  style = styles.status + ' ' + style
  return (
    <>
      <span
        className={style}
        onClick={() => setShow(true)}
        data-tip={
          text +
          (data && item.name
            ? ', last checked ' +
              new Date(parseInt(data.time) * 1000).toLocaleTimeString()
            : '')
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

export default OnlineStatus;
