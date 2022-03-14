import styles from './IconAdd.module.css'
import iconStyles from './Icon.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'

type Props = {
  size?: SizeProp
}

const IconAdd: FC<Props> = ({ size }) => {
  return (
    <div className={iconStyles.icon + ' ' + styles.add + ' rounded'}>
      <FontAwesomeIcon icon={faPlus} size={size} />
    </div>
  )
}

export default IconAdd
