import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './IconSponsor.module.css'
import { FC } from 'react'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'

type Props = {
  size?: SizeProp
}

const IconSponsor: FC<Props> = ({ size }) => {
  return (
    <FontAwesomeIcon
      icon={faStar}
      size={size}
      className={styles.sponsor}
      data-tip={'Sponsor'}
    />
  )
}

export default IconSponsor
