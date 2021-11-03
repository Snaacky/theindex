import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useSWR from 'swr'
import styles from './SupportBanner.module.css'

const nextJSLocation = typeof window === 'undefined'

const SupportBanner: FC = () => {
  const [show, setShow] = useState<boolean>()
  let { data: ip } = useSWR('/api/ip-info')

  const handleShow = () => {
    const obj = {
      value: true,
    }

    if (!nextJSLocation) {
      localStorage.setItem('hideSupportAlert', JSON.stringify(obj))
      setShow(false)
    }
  }

  // just forcing a refresh if we're setting the localStorage
  // this will remove the alert without refreshing the page
  useEffect(() => {
    if (!nextJSLocation) {
      setShow(!JSON.parse(localStorage.getItem('hideSupportAlert')))
    } else {
      setShow(true)
    }
  }, [nextJSLocation])

  if (show) {
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

  return null
}

export default SupportBanner
