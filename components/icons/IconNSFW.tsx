import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './IconNSFW.module.css'
import { FC } from 'react'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'

type Props = {
  size?: SizeProp
}

const IconNSFW: FC<Props> = ({ size }) => {
  return (
    <span className={styles.nsfw + ' fa-layers fa-fw'} data-tip={'NSFW'}>
      <FontAwesomeIcon icon={['fas', 'ban']} size={size} />
      <span
        className={'fa-layers-text'}
        style={{
          fontSize: '0.95rem',
        }}
      >
        18
      </span>
    </span>
  )
}

export default IconNSFW
