import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'
import { FC } from 'react'

type Props = {
  size?: SizeProp
}

const IconColumn: FC<Props> = ({ size }) => {
  return <FontAwesomeIcon icon={['fas', 'columns']} size={size} />
}

export default IconColumn
