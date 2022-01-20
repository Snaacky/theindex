import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './IconEdit.module.css'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'
import { FC } from 'react'

type Props = {
  size?: SizeProp
}

const IconEdit: FC<Props> = ({ size }) => {
  return (
    <FontAwesomeIcon
      icon={['fas', 'edit']}
      size={size}
      className={styles.edit}
    />
  )
}

export default IconEdit
