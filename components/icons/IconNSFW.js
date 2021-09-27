import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './IconNSFW.module.css'

export default function IconNSFW({ size }) {
  return (
    <span className={styles.nsfw + ' fa-layers fa-fw'} title={'NSFW'}>
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
