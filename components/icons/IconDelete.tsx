import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, MouseEventHandler } from 'react'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'

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
      <FontAwesomeIcon icon={['fas', 'trash-alt']} size={size} />
    </button>
  )
}

export default IconDelete
