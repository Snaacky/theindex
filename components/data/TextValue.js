export default function TextValue({ data, column, onChange = null }) {
  if (onChange === null) {
    return <div>{data}</div>
  }

  return (
    <>
      <textarea
        data-tip={'View column ' + column.name}
        className={'form-control'}
        rows={3}
        value={data}
        id={'textColumnInput-' + column._id}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  )
}
