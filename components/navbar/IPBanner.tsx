import { FC } from 'react'
import Loader from '../loading'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useSWR from 'swr'

const showGeo = (geo) => {
  if (geo === null) {
    return (
      <kbd>
        <code>unknown</code>
      </kbd>
    )
  }

  return (
    <kbd>
      <code>{geo.country}</code>
    </kbd>
  )
}

const IPBanner: FC = () => {
  let { data: ip } = useSWR('/api/ip-info')

  return (
    <div className={'w-100 d-flex align-items-center justify-content-center'}>
      <div className={''}>
        Your IP is{' '}
        {ip && ip.ip ? (
          <kbd>
            <code>{ip.ip}</code>
          </kbd>
        ) : (
          <div className={'d-inline-flex'}>
            <Loader showText={false} />
          </div>
        )}{' '}
        from{' '}
        {ip ? (
          showGeo(ip.geo)
        ) : (
          <div className={'d-inline-flex'}>
            <Loader showText={false} />
          </div>
        )}{' '}
        <Link href={'/help-ip'}>
          <a className={'text-primary'}>
            Learn more <FontAwesomeIcon icon={['fas', 'chevron-right']} />
          </a>
        </Link>
      </div>
    </div>
  )
}

export default IPBanner
