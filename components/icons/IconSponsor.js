import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './IconSponsor.module.css'

export default function IconSponsor({ size }) {
  return (
    <FontAwesomeIcon
      icon={['fas', 'star']}
      size={size}
      className={styles.sponsor}
      title={'Sponsor'}
    />
  )
}
