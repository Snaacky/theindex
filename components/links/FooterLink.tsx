import React, { FC } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconName } from '@fortawesome/fontawesome-common-types'

type Props = {
  name: string
  url: string
  icon?: IconName
  customIcon?: boolean
  customIconName?: string
}

const FooterLink: FC<Props> = ({
  name,
  url,
  icon,
  customIcon,
  customIconName,
}) => {
  return (
    <div className='d-flex icon-link-hover my-2'>
      <a
        href={url}
        target='_blank'
        rel='noreferrer'
        aria-label={name}
        className='d-flex align-items-center'
      >
        {customIcon && (
          <Image
            src={`/icons/${customIconName}`}
            height={18}
            width={18}
            alt={name}
          />
        )}

        {!customIcon && (
          <FontAwesomeIcon icon={['fab', `${icon}`]} fixedWidth={true} />
        )}
        <span className='ms-2'>{name}</span>
      </a>
    </div>
  )
}

export default FooterLink
