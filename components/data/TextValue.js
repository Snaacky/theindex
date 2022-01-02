import ReactTooltip from 'react-tooltip'

export default function TextValue({ data, column, onChange = null }) {
  if (onChange === null) {
    return <div>{data}</div>
  }
  const tooltipId = 'tooltip-textBadge-' + column.name

  return (
    <>
      <textarea
        data-tip
        data-for={tooltipId}
        className={'form-control'}
        rows={'3'}
        value={data}
        id={'textColumnInput-' + column._id}
        onChange={(e) => onChange(e.target.value)}
      />
      <ReactTooltip id={tooltipId} place='top' type='dark' effect='solid'>
        <span>View column {column.name}</span>
      </ReactTooltip>
    </>
  )
}
