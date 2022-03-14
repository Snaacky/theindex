import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'
import { faListOl } from '@fortawesome/free-solid-svg-icons/faListOl'

type Props = {
  size?: SizeProp
}

const IconList: FC<Props> = ({ size }) => {
  return <FontAwesomeIcon icon={faListOl} size={size} />
}

export default IconList
