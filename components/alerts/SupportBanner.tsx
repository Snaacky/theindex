import { FC, useEffect, useState } from 'react'
import Loader from '../loading'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useSWR from 'swr'
import styles from './SupportBanner.module.css'

const nextJSLocation = typeof window === 'undefined'

const SupportBanner: FC = () => {
  const [show, setShow] = useState<boolean>()
  const [ipInfo, setIpInfo] = useState(null)
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

  useEffect(() => {
    console.log('Yo', ip)
    if (ip && ip.ip) {
      fetch('https://ipapi.co/' + ip.ip + '/json/')
        .then((d) => {
          if (d.ok) {
            return d.json()
          }
          throw Error('Request failed...' + d)
        })
        .then((data) => {
          setIpInfo(data)
        })
        .catch((e) => {
          console.error('Oh no failed to get IP-Info', e)
        })
    }
  }, [ip])

  if (show) {
    return (
      <div className={styles.bg}>
        <span className={'me-3'}>
          Your IP{' '}
          {ip ? (
            <kbd>
              <code>{ip.ip ?? 'unknown'}</code>
            </kbd>
          ) : (
            <div className={'d-inline-flex'}>
              <Loader showText={false} />
            </div>
          )}{' '}
          from{' '}
          {ipInfo ? (
            <kbd>
              <code>{ipInfo.org ?? 'unknown'}</code>
            </kbd>
          ) : (
            <div className={'d-inline-flex'}>
              <Loader showText={false} />
            </div>
          )}{' '}
          is exposed
        </span>
        <div>
          <Link href={'/help-ip'}>
            <a className={'me-3 text-primary'}>
              Learn more <FontAwesomeIcon icon={['fas', 'chevron-right']} />
            </a>
          </Link>
          <a
            href={'javascript:console.log("Ok")'}
            className={'text-primary'}
            onClick={handleShow}
          >
            I&apos;m not interested{' '}
            <FontAwesomeIcon icon={['fas', 'chevron-right']} />
          </a>
        </div>
      </div>
    )
  }

  return null
}

export default SupportBanner
