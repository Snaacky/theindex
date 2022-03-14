import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSession } from 'next-auth/react'
import { FC, useState } from 'react'
import LoginModal from '../modals/LoginModal'
import { isLogin } from '../../lib/session'
import ItemToListModal from '../modals/ItemToListModal'
import iconStyles from './Icon.module.css'
import styles from './IconBookmark.module.css'
import { Item } from '../../types/Item'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'
import { faBookmark } from '@fortawesome/free-solid-svg-icons/faBookmark'
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons/faBookmark'

type Props = {
  item: Item
  size?: SizeProp
}

const IconBookmark: FC<Props> = ({ item, size }) => {
  const { data: session } = useSession()
  const [show, setShow] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  return (
    <>
      <span
        className={iconStyles.icon + ' ' + styles.bookmark}
        data-tip={'Add item to list'}
        onClick={() => {
          setShow(!show)
        }}
        onMouseOver={() => setIsHovering(true)}
        onMouseOut={() => setIsHovering(false)}
      >
        <FontAwesomeIcon
          icon={isHovering ? faBookmark : farBookmark}
          size={size}
        />
      </span>
      {show &&
        (isLogin(session) ? (
          <ItemToListModal item={item} close={() => setShow(false)} />
        ) : (
          <LoginModal
            text={'Cannot save item to list of non existing user'}
            close={() => setShow(false)}
          />
        ))}
    </>
  )
}

export default IconBookmark
