import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'
import { faSitemap } from '@fortawesome/free-solid-svg-icons/faSitemap'

type Props = {
  size?: SizeProp
}

const IconItem: FC<Props> = ({ size }) => {
  return <FontAwesomeIcon icon={faSitemap} size={size} />
}

export default IconItem
