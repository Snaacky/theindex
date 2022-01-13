import Link from 'next/link'
import DataBadge from './DataBadge'
import { Column, ColumnType } from '../../types/Column'
import ISO6391 from 'iso-639-1'
import { FC } from 'react'

type Props = {
  data: string[]
  column: Column
  onChange?: (values: string[]) => void
}

const ArrayValue: FC<Props> = ({ data, column, onChange = null }) => {
  if (onChange === null) {
    return (
      <>
        {data.map((v) => (
          <Link href={'/column/' + column.urlId + '?v=' + v} key={v}>
            <a
              className={'me-2'}
              data-tip={'View column ' + column.name + ' with value ' + v}
            >
              <DataBadge name={v} />
            </a>
          </Link>
        ))}
      </>
    )
  }

  let values = []
  if (column.type === ColumnType.array) {
    values = column.values
  } else if (column.type === ColumnType.language) {
    values = ISO6391.getAllCodes()
  }

  return (
    <>
      {values.map((v) => {
        return (
          <a
            data-tip={
              column.type === ColumnType.language ? ISO6391.getName(v) : v
            }
            className={'me-2'}
            key={v}
            onClick={() => {
              if (data.includes(v)) {
                onChange(data.filter((d) => d !== v))
              } else {
                onChange(data.concat([v]))
              }
            }}
          >
            <DataBadge data={data.includes(v) ? true : null} name={v} />
          </a>
        )
      })}
    </>
  )
}

export default ArrayValue
