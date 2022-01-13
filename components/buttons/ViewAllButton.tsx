import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './ViewAllButton.module.css'
import { FC } from 'react'
import { Types } from '../../types/Components'
import { singularToPlural } from '../../lib/utils'

type Props = {
  type: Types
}

const ViewAllButton: FC<Props> = ({ type }) => {
  return (
    <Link href={'/' + singularToPlural(type)}>
      <a className={'btn btn-outline-secondary'}>
        View all <span className={styles.type}>{type}</span>
        <FontAwesomeIcon
          icon={['fas', 'arrow-alt-circle-right']}
          className={'ms-2'}
        />
      </a>
    </Link>
  )
}

export default ViewAllButton
