import { IconName } from '@fortawesome/fontawesome-common-types'
import { FC } from 'react'

// import styles
import styles from './Footer.module.css'

// import components
import FooterLink from '../links/FooterLink'

type SocialsType = {
  name: string
  url: string
  icon: IconName
}

type OtherTypes = {
  name: string
  url: string
  icon: string
}

// this can be a separated JSON or something similar in the project for easy editing
const socials: SocialsType[] = [
  {
    name: 'Reddit',
    url: 'https://www.reddit.com/r/animepiracy/',
    icon: 'reddit',
  },
  {
    name: 'Discord',
    url: 'https://discord.gg/piracy',
    icon: 'discord',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/ranimepiracy',
    icon: 'twitter',
  },
  {
    name: 'Github',
    url: 'https://github.com/ranimepiracy/index',
    icon: 'github',
  },
]

const otherServices: OtherTypes[] = [
  {
    name: 'Wiki',
    url: 'https://wiki.piracy.moe/',
    icon: 'wikijs.svg',
  },
  {
    name: 'Old Index',
    url: 'https://old.piracy.moe/',
    icon: 'logo.png',
  },
]

type Props = {
  error: string
}

const Footer: FC<Props> = ({ error }) => {
  return (
    <footer className={'mt-auto py-3 bg-2'} style={{ color: '#c6c6c6' }}>
      <div className='container'>
        <div className='row'>
          <div className='col-6 col-md-3 col-lg-2'>
            <div className={styles.footerLink}>
              <h3 className={styles.linkGroupTitle}>Socials</h3>
              {socials.map((social, idx) => (
                <FooterLink
                  key={idx}
                  url={social.url}
                  name={social.name}
                  icon={social.icon}
                />
              ))}
            </div>
          </div>
          <div className='col-6 col-md-3 col-lg-2'>
            <div className={styles.footerLink}>
              <h3 className={styles.linkGroupTitle}>Other Services</h3>
              {otherServices.map((social, idx) => (
                <FooterLink
                  key={idx}
                  url={social.url}
                  name={social.name}
                  customIcon={true}
                  customIconName={social.icon}
                />
              ))}
            </div>
          </div>
          <div className='col'>
            <div className={styles.footerLink}>
              <h3 className={styles.linkGroupTitle}>About Anime Index</h3>
              {error ? (
                <div>
                  HTTP status code <kbd className={'text-danger'}>{error}</kbd>
                </div>
              ) : (
                <div>
                  The Anime Index is an index listing and comparing all
                  different types of websites, applications, and services for
                  consuming Japanese media. We do not host any copyright
                  infringing files, our services do not enable any sort of file
                  sharing, and we strictly forbid the distribution of
                  copyrighted media. All data is provided faithfully to the best
                  of our knowledge and is subject to change without prior
                  notice. We are not affiliated or partnered with any of the
                  services or applications listed. We are affiliated with
                  certain VPN providers via their referral affiliate program and
                  receive a commission for signups via our affiliate links. We
                  are not responsible for any of the services listed on the
                  index.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-center mt-4 text-muted'>
        <span>Anime Index Team © 2021</span>
      </div>
    </footer>
  )
}

export default Footer
