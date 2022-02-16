import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { canEdit } from '../../lib/session'
import styles from './Row.module.css'
import IconAdd from '../icons/IconAdd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IconDelete from '../icons/IconDelete'
import IconEdit from '../icons/IconEdit'
import DataBadge from '../data/DataBadge'
import Loader from '../loading'
import IconBookmark from '../icons/IconBookmark'
import IconStar from '../icons/IconStar'
import OnlineStatus from '../data/OnlineStatus'
import IconNSFW from '../icons/IconNSFW'
import IconSponsor from '../icons/IconSponsor'
import Title from '../text/Title'
import { FC } from 'react'
import { Types } from '../../types/Components'
import { List } from '../../types/List'
import { User } from '../../types/User'
import { Collection } from '../../types/Collection'
import { Column } from '../../types/Column'
import { Library } from '../../types/Library'
import { Item } from '../../types/Item'

type Props = {
  type: Types
  content: User | List | Collection | Column | Library | Item
  imageUrl?: string
  bodyContent?: any
  move?: (order: number) => void
  add?: () => void
  remove?: () => void
}

const Row: FC<Props> = ({
  type,
  content,
  imageUrl = '',
  bodyContent = null,
  move = null,
  add = null,
  remove = null,
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
    <div className={styles.row + ' card bg-2 mb-2'}>
      <div className='row g-0'>
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
        {add !== null && (
          <div className={styles.sorter + ' col-auto'}>
            <a
              onClick={add}
              data-tip={'Add ' + type}
              style={{
                height: '32px',
              }}
            >
              <IconAdd />
            </a>
          </div>
        )}
        {imageUrl !== '' && (
          <div className={styles.column + ' col-auto p-1'}>
            <Link href={hrefString}>
              <a
                data-tip={'View ' + type + ' ' + (content.name ?? '')}
                className={'umami--click--' + type + '-' + content.name}
              >
                <Image
                  src={imageUrl}
                  className='img-fluid rounded-start'
                  alt='...'
                  width={64}
                  height={64}
                />
              </a>
            </Link>
          </div>
        )}
        <div className='col'>
          <div className={'card-body p-2'}>
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
              )}
              <span className={'float-end'} style={{ fontSize: '1.2rem' }}>
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
                  <>
                    <span className={'ms-2'}>
                      <IconStar item={content as Item} />
                    </span>
                    <span className={'ms-2'}>
                      <IconBookmark item={content as Item} />
                    </span>
                  </>
                )}
              </span>
            </h5>

            <Link href={hrefString}>
              <a
                className={
                  styles.link + ' umami--click--' + type + '-' + content.name
                }
              >
                <span className={styles.description + ' card-text'}>
                  {content.description}
                </span>

                {bodyContent}
              </a>
            </Link>
          </div>
        </div>
        {remove !== null && (
          <div className={styles.column + ' col-auto p-1'}>
            <IconDelete
              onClick={remove}
              title={'Remove ' + type}
              className={'float-end'}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Row
