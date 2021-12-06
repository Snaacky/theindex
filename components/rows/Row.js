import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/client'
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

export default function Row({
  type,
  content,
  imageUrl = '',
  bodyContent = null,
  move = null,
  add = null,
  remove = null,
}) {
  const [session] = useSession()
  const hrefString =
    '/' + type + '/' + (content.urlId ?? content.uid ?? content._id)

  if (typeof content === 'undefined') {
    return <Loader />
  }

  return (
    <div
      className={
        styles.row +
        ' ' +
        (content.sponsor ? styles.sponsored : '') +
        ' card bg-2 mb-2'
      }
    >
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
              title={'Add ' + type}
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
                title={'View ' + type + ' ' + (content.name ?? '')}
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
              {typeof content.urls !== 'undefined' && (
                <OnlineStatus url={content.urls[0] ?? ''} />
              )}

              <Title type={type} content={content} contentLink={hrefString} />

              {canEdit(session, type) && (
                <Link
                  href={'/edit/' + type + '/' + (content.uid ?? content._id)}
                >
                  <a title={'Edit ' + type} className={'ms-2'}>
                    <IconEdit />
                  </a>
                </Link>
              )}
              {content.sponsor && (
                <span className={styles.sponsorBadge + ' ms-2 float-end'}>
                  <span className={styles.sponsorIcon}>
                    <IconSponsor size='xs' />
                  </span>
                  Sponsored
                </span>
              )}
              <span className={'float-end'} style={{ fontSize: '1.2rem' }}>
                {content.nsfw && (
                  <span className={'ms-2'}>
                    <IconNSFW />
                  </span>
                )}
                {content.accountType && (
                  <span className={'ms-2'}>
                    <DataBadge name={content.accountType} style={'primary'} />
                  </span>
                )}
                {type === 'item' && (
                  <>
                    <span className={'ms-2'}>
                      <IconStar item={content} />
                    </span>
                    <span className={'ms-2'}>
                      <IconBookmark item={content} />
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
              style={{
                width: '42px',
                height: '42px',
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
