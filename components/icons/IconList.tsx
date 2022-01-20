import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'

type Props = {
  size?: SizeProp
}

const IconList: FC<Props> = ({ size }) => {
  return <FontAwesomeIcon icon={['fas', 'list-ol']} size={size} />
}

export default IconList
