import styles from './UrlBadge.module.css'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { isValidUrl } from '../../lib/utils'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt'

export default function UrlBadge({ url, className = '' }) {
  if (isValidUrl(url)) {
    return (
      <Link
        href={url}
        target={'_blank'}
        rel={'noreferrer'}
        className={'me-2 mb-2 ' + className}
      >
        <div className={styles.badge + ' badge rounded-pill'}>
          {url}
          <span className={'ms-2'}>
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </span>
        </div>
      </Link>
    )
  }

  return (
    <div
      className={
        styles.badge + ' badge rounded-pill bg-outline-danger me-2 mb-2'
      }
    >
      {url}
      <span className={'ms-2'}>
        <FontAwesomeIcon icon={faExternalLinkAlt} />
      </span>
    </div>
  )
}
