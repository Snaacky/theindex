import Link from 'next/link'
import DataBadge from './DataBadge'
import { Column, ColumnType } from '../../types/Column'
import { FC } from 'react'

const badgeButtonStyle = {
  backgroundColor: 'transparent',
  borderStyle: 'none',
}

type Props = {
  data: string[]
  column: Column
  onChange?: (values: string[]) => void
}

const ArrayValue: FC<Props> = ({ data, column, onChange }) => {
  if (column.type !== ColumnType.array) {
    console.error('Called ArrayValue but column type is', column.type)
    return
  }

  if (typeof onChange === 'undefined') {
    return (
      <>
        {data.map((v) => (
          <Link
            href={'/column/' + column.urlId + '?v=' + v}
            key={v}
            className={'me-1'}
            data-tooltip-content={column.name + ': ' + v}
          >
            <DataBadge name={v} />
          </Link>
        ))}
      </>
    )
  }

  return (
    <>
      {column.values.map((v) => {
        return (
          <button
            data-tooltip-content={v}
            className={'me-1'}
            style={badgeButtonStyle}
            key={v}
            onClick={() => {
              if (data.includes(v)) {
                onChange(data.filter((d) => d !== v))
              } else {
                onChange(data.concat([v]))
              }
            }}
          >
            <DataBadge data={data.includes(v) ? true : undefined} name={v} />
          </button>
        )
      })}
    </>
  )
}

export default ArrayValue
