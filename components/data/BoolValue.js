import Link from 'next/link'
import DataBadge from './DataBadge'
import ReactTooltip from 'react-tooltip'

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
          <a data-tip data-for={tooltipId} className={'me-2'}>
            <DataBadge data={data} name={column.name} sponsor={sponsor} />
          </a>
        </Link>
        <ReactTooltip id={tooltipId} place='top' type='dark' effect='solid'>
          <span>View column {column.name}</span>
        </ReactTooltip>
      </>
    )
  }

  return (
    <>
      <a
        data-tip
        data-for={tooltipId}
        onClick={() => {
          if (typeof data === 'boolean') {
            onChange(data ? false : null)
          } else {
            onChange(true)
          }
        }}
      >
        <DataBadge
          data={data}
          name={column.name}
          tooltip={'Filter by column ' + column.name}
          sponsor={sponsor}
        />
      </a>
      <ReactTooltip id={tooltipId} place='top' type='dark' effect='solid'>
        <span>Filter by column {column.name}</span>
      </ReactTooltip>
    </>
  )
}
