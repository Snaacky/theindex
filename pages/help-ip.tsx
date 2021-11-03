import Head from 'next/head'
import React from 'react'
import useSWR from 'swr'
import Loader from '../components/loading'

const title = 'Your IP info | ' + process.env.NEXT_PUBLIC_SITE_NAME
const description = 'See what data about your location you are exposing'

export default function IpInfo() {
  let { data: ip } = useSWR('/api/ip-info')

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='robots' content='noindex, noarchive' />

        <meta property='og:title' content={title} />
        <meta name='twitter:title' content={title} />

        <meta name='description' content={description} />
        <meta property='og:description' content={description} />
        <meta name='twitter:description' content={description} />
      </Head>

      <h2>
        Your IP{' '}
        {ip && ip.ip ? (
          <kbd>
            <code>{ip.ip}</code>
          </kbd>
        ) : (
          <div className={'d-inline-flex'}>
            <Loader showText={false} />
          </div>
        )}
      </h2>
      <p>{description}.</p>

      <h3>
        Country{' '}
        {ip ? (
          <kbd>
            <code>{ip.geo ? ip.geo.country : 'unknown'}</code>
          </kbd>
        ) : (
          <div className={'d-inline-flex'}>
            <Loader showText={false} />
          </div>
        )}
      </h3>
      <ul>
        <li>
          Region{' '}
          {ip ? (
            <kbd>
              <code>{ip.geo ? ip.geo.region : 'unknown'}</code>
            </kbd>
          ) : (
            <div className={'d-inline-flex'}>
              <Loader showText={false} />
            </div>
          )}
        </li>
        <li>
          City{' '}
          {ip ? (
            <kbd>
              <code>{ip.geo ? ip.geo.city : 'unknown'}</code>
            </kbd>
          ) : (
            <div className={'d-inline-flex'}>
              <Loader showText={false} />
            </div>
          )}
        </li>
        <li>
          Latitude and longitude{' '}
          {ip ? (
            <kbd>
              <code>{ip.geo ? ip.geo.ll.join(', ') : 'unknown'}</code>
            </kbd>
          ) : (
            <div className={'d-inline-flex'}>
              <Loader showText={false} />
            </div>
          )}{' '}
          within a radius of{' '}
          {ip ? (
            <kbd>
              <code>{ip.geo ? ip.geo.area : 'unknown'}</code>
            </kbd>
          ) : (
            <div className={'d-inline-flex'}>
              <Loader showText={false} />
            </div>
          )}
          km
        </li>
      </ul>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 30,
  }
}
