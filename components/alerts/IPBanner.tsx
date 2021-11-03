import { FC, useEffect, useState } from 'react'
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
  const [show, setShow] = useState<boolean>(typeof window !== 'undefined')
  let { data: ip } = useSWR('/api/ip-info')

  const handleShow = () => {
    const obj = {
      value: true,
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('hideIpAlert', JSON.stringify(obj))
      setShow(false)
    }
  }

  // just forcing a refresh if we're setting the localStorage
  // this will remove the alert without refreshing the page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShow(!JSON.parse(localStorage.getItem('hideIpAlert')))
    } else {
      setShow(true)
    }
  })

  if (show) {
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
          )}
          <Link href={'/help-ip'}>
            <a className={'ms-3 text-primary'}>
              Learn more <FontAwesomeIcon icon={['fas', 'chevron-right']} />
            </a>
          </Link>
          <a
            href={'javascript:console.log("Ok")'}
            className={'ms-3 text-primary'}
            onClick={handleShow}
          >
            I know my risks <FontAwesomeIcon icon={['fas', 'chevron-right']} />
          </a>
        </div>
      </div>
    )
  }

  return null
}

export default IPBanner
