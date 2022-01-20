import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'

type Props = {
  size?: SizeProp
}

const IconLibrary: FC<Props> = ({ size }) => {
  return <FontAwesomeIcon icon={['fas', 'database']} size={size} />
}

export default IconLibrary
