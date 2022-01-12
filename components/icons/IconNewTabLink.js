import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { isValidUrl } from '../../lib/utils'
import styles from './IconNewTabLink.module.css'

export default function IconNewTabLink({ url, size, className = '' }) {
  if (isValidUrl(url)) {
    return (
      <a
        className={styles.link + ' ms-2 ' + className}
        target={'_blank'}
        href={url}
        rel='noreferrer'
        data-tip={'Open in new tab'}
      >
        <FontAwesomeIcon icon={['fas', 'external-link-alt']} size={size} />
      </a>
    )
  }

  return (
    <span data-tip={url && url !== '' ? 'Invalid url' : 'Missing url'}>
      <FontAwesomeIcon
        icon={['fas', 'external-link-alt']}
        size={size}
        className={'ms-2 text-danger'}
      />
    </span>
  )
}
