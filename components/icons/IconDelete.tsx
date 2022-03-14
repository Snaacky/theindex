import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, MouseEventHandler } from 'react'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt'

type Props = {
  className?: string
  size?: SizeProp
  onClick?: MouseEventHandler
  title: string
}

const IconDelete: FC<Props> = ({ className, size, onClick, title }) => {
  return (
    <button
      className={className + ' btn btn-outline-danger'}
      data-tip={title}
      type={'button'}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faTrashAlt} size={size} />
    </button>
  )
}

export default IconDelete
