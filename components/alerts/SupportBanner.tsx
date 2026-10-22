import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './SupportBanner.module.css'
import { faFingerprint } from '@fortawesome/free-solid-svg-icons/faFingerprint'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight'

type IpInfo = {
  ip?: string
  geo?: {
    city?: string
    country?: string
  } | null
}

let cachedIpInfo: IpInfo | null = null
let pendingIpInfoRequest: Promise<IpInfo> | null = null

async function loadIpInfo() {
  if (cachedIpInfo !== null) {
    return cachedIpInfo
  }

  if (pendingIpInfoRequest !== null) {
    return await pendingIpInfoRequest
  }

  pendingIpInfoRequest = fetch('/api/ip-info')
    .then(async (response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch IP info')
      }

      const data = (await response.json()) as IpInfo
      cachedIpInfo = data
      return data
    })
    .finally(() => {
      pendingIpInfoRequest = null
    })

  return await pendingIpInfoRequest
}

const SupportBanner: FC = () => {
  const [ip, setIp] = useState<IpInfo | null>(cachedIpInfo)

  useEffect(() => {
    if (cachedIpInfo !== null) {
      return
    }

    void loadIpInfo()
      .then((data) => {
        setIp(data)
      })
      .catch((error) => {
        console.error('Failed to load support banner IP data', error)
      })
  }, [])

  let location: string | false = false
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
        <Link href={'/library/vpns'} className={'me-3'}>
          Learn more <FontAwesomeIcon icon={faChevronRight} />
        </Link>
      </div>
    </div>
  )
}

export default SupportBanner
