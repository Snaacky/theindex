import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './ViewAllButton.module.css'
import { FC } from 'react'
import { Types } from '../../types/Components'
import { singularToPlural } from '../../lib/utils'
import Button from './Button'
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons/faArrowAltCircleRight'

type Props = {
  type: Types
}

const ViewAllButton: FC<Props> = ({ type }) => {
  return (
    <Button
      href={'/' + singularToPlural(type)}
      hover={'Show all ' + singularToPlural(type)}
    >
      View all <span className={styles.type}>{singularToPlural(type)}</span>
      <FontAwesomeIcon icon={faArrowAltCircleRight} className={'ms-2'} />
    </Button>
  )
}

export default ViewAllButton
