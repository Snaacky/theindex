import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase'

type Props = {
  size?: SizeProp
}

const IconLibrary: FC<Props> = ({ size }) => {
  return <FontAwesomeIcon icon={faDatabase} size={size} />
}

export default IconLibrary
