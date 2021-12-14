import { FC } from 'react'
import { Types } from '../../types/Components'
import CardRowView from '../CardRowView'
import styles from './FlexRow.module.css'

type Props = {
  type: Types
  contents: any[]
}

const FlexRow: FC<Props> = ({ type, contents }) => {
  return (
    <div className={styles.container}>
      {contents.map((content) => {
        return (
          <div key={content._id} className={styles.card}>
            <CardRowView type={type} content={content} />
          </div>
        )
      })}
    </div>
  )
}

export default FlexRow
