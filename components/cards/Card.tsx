import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { canEdit } from '../../lib/session'
import styles from './Card.module.css'
import IconEdit from '../icons/IconEdit'
import IconDelete from '../icons/IconDelete'
import IconAdd from '../icons/IconAdd'
import DataBadge from '../data/DataBadge'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Loader from '../loading'
import IconBookmark from '../icons/IconBookmark'
import IconStar from '../icons/IconStar'
import OnlineStatus from '../data/OnlineStatus'
import IconNSFW from '../icons/IconNSFW'
import IconSponsor from '../icons/IconSponsor'
import Title from '../text/Title'
import classNames from 'classnames'
import { Types } from '../../types/Components'
import { User } from '../../types/User'
import { List } from '../../types/List'
import { Collection } from '../../types/Collection'
import { Column } from '../../types/Column'
import { Library } from '../../types/Library'
import { Item } from '../../types/Item'
import { FC } from 'react'

type Props = {
  type: Types
  content: User | List | Collection | Column | Library | Item
  imageUrl?: string
  bodyContent?: any
  move?: (order: number) => void
  add?: () => void
  remove?: () => void
}

const Card: FC<Props> = ({
  type,
  content,
  imageUrl = '',
  bodyContent = null,
  add = null,
  remove = null,
  move = null,
}) => {
  const { data: session } = useSession()
  const hrefString =
    '/' +
    type +
    '/' +
    ('urlId' in content
      ? content.urlId
      : 'uid' in content
      ? content.uid
      : content._id)

  if (typeof content === 'undefined') {
    return <Loader />
  }

  return (
    <div className={styles.card + ' card bg-2 mb-2 me-2'}>
      <div className='row g-0 h-100'>
        {move !== null && (
          <div className={styles.sorter + ' col-auto'}>
            <a onClick={() => move(-1)}>
              <FontAwesomeIcon icon={['fas', 'chevron-up']} />
            </a>
            <a onClick={() => move(1)}>
              <FontAwesomeIcon icon={['fas', 'chevron-down']} />
            </a>
          </div>
        )}
        {imageUrl !== '' && (
          <div className={'col-auto'}>
            <Link href={hrefString}>
              <a
                data-tip={'View ' + type + ' ' + (content.name ?? '')}
                className={'umami--click--' + type + '-' + content.name}
              >
                <Image
                  src={imageUrl}
                  className='img-fluid rounded-start'
                  alt='...'
                  width={128}
                  height={128}
                />
              </a>
            </Link>
          </div>
        )}
        <div className='col h-100'>
          <div className={'card-body d-flex flex-column p-2 h-100'}>
            <h5 className={styles.title + ' card-title'}>
              {'urls' in content && typeof content.urls !== 'undefined' && (
                <OnlineStatus url={content.urls[0] ?? ''} />
              )}

              {'sponsor' in content && content.sponsor && (
                <span className={'me-2'}>
                  <IconSponsor size={'sm'} data-tip={'Sponsored'} />
                </span>
              )}

              <Title type={type} content={content} contentLink={hrefString} />

              {canEdit(session, type) && (
                <>
                  <Link
                    href={
                      '/edit/' +
                      type +
                      '/' +
                      ('uid' in content && content.uid
                        ? content.uid
                        : content._id)
                    }
                  >
                    <a data-tip={'Edit ' + type} className={'ms-2'}>
                      <IconEdit />
                    </a>
                  </Link>
                </>
              )}
              <span className={styles.action}>
                {'nsfw' in content && content.nsfw && (
                  <span className={'ms-2'}>
                    <IconNSFW />
                  </span>
                )}
                {'accountType' in content && content.accountType && (
                  <span className={'ms-2'}>
                    <DataBadge name={content.accountType} style={'primary'} />
                  </span>
                )}
                {type === Types.item && (
                  <span className={'float-end'}>
                    <span className={'ms-2'}>
                      <IconStar item={content as Item} />
                    </span>
                    <span className={'ms-2'}>
                      <IconBookmark item={content as Item} />
                    </span>
                  </span>
                )}
                {add !== null && (
                  <a
                    data-tip={'Add ' + type}
                    className={styles.link + ' float-end'}
                    onClick={add}
                  >
                    <IconAdd />
                  </a>
                )}
                {remove !== null && (
                  <IconDelete
                    title={'Delete ' + type}
                    className={styles.link + ' float-end'}
                    onClick={remove}
                  />
                )}
              </span>
            </h5>

            <Link href={hrefString}>
              <a
                className={classNames(
                  styles.link,
                  'umami--click--' + type + '-' + content.name,
                  'h-100'
                )}
              >
                <span className={styles.description + ' card-text'}>
                  {content.description}
                </span>
                {bodyContent !== null && bodyContent}
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
