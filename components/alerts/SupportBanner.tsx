import { FC } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useSWR from 'swr'
import styles from './SupportBanner.module.css'

const SupportBanner: FC = () => {
  let { data: ip } = useSWR('/api/ip-info')

  return (
    <div className={styles.bg}>
      <span className={'me-3'}>
        <FontAwesomeIcon icon={['fas', 'fingerprint']} className={'me-3'} />
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
        from{' '}
        {ip && ip.geo ? (
          <kbd>
            <code>{ip.geo.city ?? 'unknown'}</code>
          </kbd>
        ) : (
          <div className='spinner-border spinner-border-sm' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        )}{' '}
        is exposed
      </span>
      <div>
        <Link href={'/help-ip'}>
          <a className={'me-3'}>
            Learn more <FontAwesomeIcon icon={['fas', 'chevron-right']} />
          </a>
        </Link>
      </div>
    </div>
  )
}

export default SupportBanner
