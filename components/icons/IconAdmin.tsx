import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'
import { faWrench } from '@fortawesome/free-solid-svg-icons/faWrench'

type Props = {
  size?: SizeProp
}

const IconAdmin: FC<Props> = ({ size }) => {
  return (
    <FontAwesomeIcon icon={faWrench} size={size} className={'text-warning'} />
  )
}

export default IconAdmin
