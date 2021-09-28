import Link from 'next/link'
import DataBadge from './DataBadge'

export default function BoolValue({
  data,
  column,
  sponsor = false,
  onChange = null,
}) {
  if (onChange === null) {
    return (
      <Link href={'/column/' + column.urlId}>
        <a className={'me-2'} title={'View column ' + column.name}>
          <DataBadge data={data} name={column.name} sponsor={sponsor} />
        </a>
      </Link>
    )
  }

  return (
    <a
      onClick={() => {
        if (typeof data === 'boolean') {
          onChange(data ? false : null)
        } else {
          onChange(true)
        }
      }}
    >
      <DataBadge data={data} name={column.name} />
    </a>
  )
}
