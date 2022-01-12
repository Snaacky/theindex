import Link from 'next/link'
import DataBadge from './DataBadge'

export default function BoolValue({
  data,
  column,
  sponsor = false,
  onChange = null,
}) {
  const tooltipId = 'tooltip-boolBadge-' + column.name

  if (onChange === null) {
    return (
      <>
        <Link href={'/column/' + column.urlId}>
          <a
            data-tip={'View column ' + column.name}
            data-for={tooltipId}
            className={'me-2'}
          >
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
        data-for={tooltipId}
        onClick={() => {
          if (typeof data === 'boolean') {
            onChange(data ? false : null)
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
