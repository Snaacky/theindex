import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './IconEdit.module.css'

export default function IconEdit({ size }) {
  return (
    <FontAwesomeIcon
      icon={['fas', 'edit']}
      size={size}
      className={styles.edit}
    />
  )
}
