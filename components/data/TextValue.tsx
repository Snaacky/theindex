import { Column } from '../../types/Column'

type Props = {
  data: string
  column: Column
  onChange?: (values: string) => void
}

export default function TextValue({ data, column, onChange }: Props) {
  if (typeof onChange === 'undefined') {
    return <div>{data}</div>
  }

  return (
    <>
      <textarea
        data-tooltip-content={'View column ' + column.name}
        className={'form-control'}
        rows={3}
        value={data}
        id={'textColumnInput-' + column._id}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  )
}
