import { FC } from 'react'
import Link from 'next/link'
import { Types } from '../../types/Components'
import { isValidUrl } from '../../lib/utils'

type Props = {
  type: Types
  content: any
  contentLink: string
}

const Title: FC<Props> = ({ type, content, contentLink }) => {
  if (type === Types.item) {
    if (isValidUrl(content.urls[0])) {
      return (
        <Link
          href={content.urls[0]}
          data-tooltip-content={'Open ' + (content.name ?? '') + ' in new tab'}
          target={'_blank'}
          rel={'noreferrer'}
          className={
            'umami--click--open-' +
            (content.sponsor ? 'sponsored-' : '') +
            content.name
          }
        >
          {content.name ?? <code>Unable to get name</code>}
        </Link>
      )
    }

    return (
      <span
        className={'text-danger'}
        data-tooltip-content={
          content.urls[0] && content.urls[0] !== ''
            ? 'Invalid url'
            : 'Missing url'
        }
      >
        {content.name ?? <code>Unable to get name</code>}
      </span>
    )
  }

  return (
    <Link
      href={contentLink}
      data-tooltip-content={'View ' + type + ' ' + (content.name ?? '')}
      className={'umami--click--' + type + '-' + content.name}
    >
      {content.name ?? (
        <code>
          <kbd>Unable to get name</kbd>
        </code>
      )}
    </Link>
  )
}

export default Title;
