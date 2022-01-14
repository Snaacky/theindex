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

const FeatureValue: FC<Props> = ({
  data,
  column,
  sponsor = false,
  onChange = null,
}) => {
  if (onChange === null) {
    return (
      <>
        <Link href={'/column/' + column.urlId}>
          <a data-tip={'View column ' + column.name} className={'me-2'}>
            <DataBadge data={data} name={column.name} sponsor={sponsor} />
          </a>
        </Link>
      </>
    )
  }

  return (
    <>
      <a
        data-tip={'Filter by column ' + column.name}
        onClick={() => {
          if (typeof data === 'boolean') {
            onChange(null)
          } else {
            onChange(true)
          }
        }}
      >
        <DataBadge data={data} name={column.name} sponsor={sponsor} />
      </a>
    </>
  )
}

export default FeatureValue
