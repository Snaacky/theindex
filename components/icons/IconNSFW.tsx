import styles from './IconNSFW.module.css'
import { FC } from 'react'

const IconNSFW: FC = () => {
  return (
    <span className={styles.nsfw} data-tip={'NSFW'}>
      18+
    </span>
  )
}

export default IconNSFW
