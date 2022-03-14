import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'
import { faList } from '@fortawesome/free-solid-svg-icons/faList'

type Props = {
  size?: SizeProp
}

const IconCollection: FC<Props> = ({ size }) => {
  return <FontAwesomeIcon icon={faList} size={size} />
}

export default IconCollection
