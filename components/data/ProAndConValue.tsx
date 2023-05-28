import Link from 'next/link'
import DataBadge from './DataBadge'
import { Column } from '../../types/Column'
import { FC } from 'react'

type Props = {
  data: boolean | null
  column: Column
  sponsor?: boolean
  onChange?: (data: boolean | null) => void
}

const ProAndConValue: FC<Props> = ({
  data,
  column,
  sponsor = false,
  onChange = null,
}) => {
  const displayData =
    typeof data === 'boolean' ? column.values[data ? 0 : 1] : column.name

  if (onChange === null) {
    return (
      <>
        <Link href={'/column/' + column.urlId}>
          <a
            data-tooltip-content={'View column ' + column.name}
            className={'me-2'}
          >
            <DataBadge data={data} name={displayData} sponsor={sponsor} />
          </a>
        </Link>
      </>
    )
  }

  return (
    <>
      <a
        data-tooltip-content={'Filter by column ' + column.name}
        onClick={() => {
          if (typeof data === 'boolean') {
            onChange(data ? false : null)
          } else {
            onChange(true)
          }
        }}
      >
        <DataBadge data={data} name={displayData} sponsor={sponsor} />
      </a>
    </>
  )
}

export default ProAndConValue
