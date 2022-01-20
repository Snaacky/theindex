import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './IconSponsor.module.css'
import { FC } from 'react'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'

type Props = {
  size?: SizeProp
}

const IconSponsor: FC<Props> = ({ size }) => {
  return (
    <FontAwesomeIcon
      icon={['fas', 'star']}
      size={size}
      className={styles.sponsor}
      data-tip={'Sponsor'}
    />
  )
}

export default IconSponsor
