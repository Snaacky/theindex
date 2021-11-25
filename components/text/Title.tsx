import { FC } from 'react'
import Link from 'next/link'
import { canEdit } from '../../lib/session'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSession } from 'next-auth/client'
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
        <a href={content.urls[0]} title={'Open ' + (content.name ?? '') + ' in new tab'}>
          {content.name ?? <code>Unable to get name</code>}
        </a>
      )
    }

    return (
      <span
        className={'text-danger'}
        title={
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
    <Link href={contentLink}>
      <a title={'View ' + type + ' ' + (content.name ?? '')}>
        {content.name ?? (
          <code>
            <kbd>Unable to get name</kbd>
          </code>
        )}
      </a>
    </Link>
  )
}

export default Title
