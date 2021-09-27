import styles from './IconAdd.module.css'
import iconStyles from './Icon.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function IconAdd({ size }) {
  return (
    <div className={iconStyles.icon + ' ' + styles.add + ' rounded'}>
      <FontAwesomeIcon icon={['fas', 'plus']} size={size} />
    </div>
  )
}
