import { FC } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useSWR from 'swr'
import styles from './SupportBanner.module.css'
import { faFingerprint } from '@fortawesome/free-solid-svg-icons/faFingerprint'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight'

const SupportBanner: FC = () => {
  let { data: ip } = useSWR('/api/ip-info')

  let location = false
  if (ip && ip.geo) {
    if (ip.geo.city && ip.geo.city !== '') {
      location = ip.geo.city
    } else if (ip.geo.country && ip.geo.country !== '') {
      location = ip.geo.country
    }
  }

  return (
    <div className={styles.banner}>
      <span className={'me-3 text-center'}>
        <FontAwesomeIcon icon={faFingerprint} className={'me-3'} />
        Your IP{' '}
        {ip ? (
          <kbd>
            <code>{ip.ip ?? 'unknown'}</code>
          </kbd>
        ) : (
          <div className='spinner-border spinner-border-sm' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        )}{' '}
        {location !== false && (
          <>
            {'from '}
            {ip ? (
              <kbd>
                <code>{location}</code>
              </kbd>
            ) : (
              <div className='spinner-border spinner-border-sm' role='status'>
                <span className='visually-hidden'>Loading...</span>
              </div>
            )}{' '}
          </>
        )}
        is exposed
      </span>
      <div>
        <Link href={'/library/vpns'}>
          <a className={'me-3'}>
            Learn more <FontAwesomeIcon icon={faChevronRight} />
          </a>
        </Link>
      </div>
    </div>
  )
}

export default SupportBanner
