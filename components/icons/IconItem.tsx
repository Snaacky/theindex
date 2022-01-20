import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'

type Props = {
  size?: SizeProp
}

const IconItem: FC<Props> = ({ size }) => {
  return <FontAwesomeIcon icon={['fas', 'sitemap']} size={size} />
}

export default IconItem
