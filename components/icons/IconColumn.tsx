import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'
import { FC } from 'react'
import { faColumns } from '@fortawesome/free-solid-svg-icons/faColumns'

type Props = {
  size?: SizeProp
}

const IconColumn: FC<Props> = ({ size }) => {
  return <FontAwesomeIcon icon={faColumns} size={size} />
}

export default IconColumn
