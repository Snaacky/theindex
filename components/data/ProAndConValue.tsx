import Link from 'next/link'
import DataBadge from './DataBadge'
import { Column } from '../../types/Column'
import { FC } from 'react'

const badgeButtonStyle = {
  backgroundColor: 'transparent',
  borderStyle: 'none',
}

type Props = {
  data?: boolean
  column: Column
  sponsor?: boolean
  onChange?: (data: boolean | null) => void
}

const ProAndConValue: FC<Props> = ({
  data,
  column,
  sponsor = false,
  onChange,
}) => {
  const displayData =
    typeof data === 'boolean' ? column.values[data ? 0 : 1] : column.name

  if (typeof onChange === 'undefined') {
    return (
      <>
        <Link
          href={'/column/' + column.urlId}
          data-tooltip-content={'View column ' + column.name}
          className={'me-1'}
        >
          <DataBadge data={data} name={displayData} sponsor={sponsor} />
        </Link>
      </>
    )
  }

  return (
    <>
      <button
        data-tooltip-content={'Filter by column ' + column.name}
        style={badgeButtonStyle}
        onClick={() => {
          if (typeof data === 'boolean') {
            onChange(data ? false : null)
          } else {
            onChange(true)
          }
        }}
      >
        <DataBadge data={data} name={displayData} sponsor={sponsor} />
      </button>
    </>
  )
}

export default ProAndConValue
