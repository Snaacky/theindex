export default function TextValue({ data, column, onChange = null }) {
  if (onChange === null) {
    return <div>{data}</div>
  }
  const tooltipId = 'tooltip-textBadge-' + column.name

  return (
    <>
      <textarea
        data-tip={'View column ' + column.name}
        data-for={tooltipId}
        className={'form-control'}
        rows={'3'}
        value={data}
        id={'textColumnInput-' + column._id}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  )
}
