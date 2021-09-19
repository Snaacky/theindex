import { FC } from 'react'
import useSWR from 'swr'
import classNames from 'classnames'

// import types
import styles from './EditSelectImg.module.css'

type Props = {
  selected: string
  onChange: (arg: string) => void
}
const EditSelectImg: FC<Props> = ({ selected, onChange }) => {
  let { data: imgs } = useSWR('/api/imgs')

  imgs = imgs || [selected]
  return (
      <div className={styles.imgItemsWrapper}>
        {imgs.map((img, idx) => {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={classNames(
                styles.imgItem,
                selected === img && styles.imgSelected
              )}
              src={`/img/${img}`}
              key={idx}
              alt={img}
              onClick={() => onChange(img)}
            />
          )
        })}
      </div>
  )
}

export default EditSelectImg
