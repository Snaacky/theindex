import Link from 'next/link'
import DataBadge from './DataBadge'
import { Column, ColumnType } from '../../types/Column'
import { FC } from 'react'

type Props = {
  data: string[]
  column: Column
  onChange?: (values: string[]) => void
}

const ArrayValue: FC<Props> = ({ data, column, onChange = null }) => {
  if (column.type !== ColumnType.array) {
    console.error('Called ArrayValue but column type is', column.type)
    return
  }

  if (onChange === null) {
    return (
      <>
        {data.map((v) => (
          <Link href={'/column/' + column.urlId + '?v=' + v} key={v}>
            <a className={'me-2'} data-tooltip-content={column.name + ': ' + v}>
              <DataBadge name={v} />
            </a>
          </Link>
        ))}
      </>
    )
  }

  return (
    <>
      {column.values.map((v) => {
        return (
          <a
            data-tooltip-content={v}
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
