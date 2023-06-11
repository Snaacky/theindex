import React, { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-brands-svg-icons'

type Props = {
  name: string
  url: string
  icon?: string | IconDefinition
}

const FooterLink: FC<Props> = ({ name, url, icon }) => {
  return (
    <div className='d-flex icon-link-hover my-2'>
      <Link
        href={url}
        target='_blank'
        rel='noreferrer'
        aria-label={name}
        className='d-flex align-items-center'
      >
        {typeof icon === 'string' ? (
          <Image src={`/icons/${icon}`} height={18} width={18} alt={name} />
        ) : (
          <FontAwesomeIcon icon={icon} fixedWidth={true} />
        )}
        <span className='ms-2'>{name}</span>
      </Link>
    </div>
  )
}

export default FooterLink
