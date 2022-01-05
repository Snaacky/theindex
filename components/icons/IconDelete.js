import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function IconDelete({ className, size, onClick, title }) {
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
