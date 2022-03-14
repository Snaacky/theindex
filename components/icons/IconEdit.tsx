import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './IconEdit.module.css'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'
import { FC } from 'react'
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit'

type Props = {
  size?: SizeProp
}

const IconEdit: FC<Props> = ({ size }) => {
  return <FontAwesomeIcon icon={faEdit} size={size} className={styles.edit} />
}

export default IconEdit
