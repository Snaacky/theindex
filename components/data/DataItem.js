import BoolValue from './BoolValue'
import ArrayValue from './ArrayValue'
import TextValue from './TextValue'
import { ColumnType } from '../../types/Column'

export default function DataItem({ data, column, onChange = null }) {
  if (column.type === ColumnType.boolean) {
    return <BoolValue data={data} column={column} onChange={onChange} />
  } else if (
    column.type === ColumnType.array ||
    column.type === ColumnType.language
  ) {
    return <ArrayValue data={data || []} column={column} onChange={onChange} />
  } else if (column.type === ColumnType.text) {
    return <TextValue data={data || ''} column={column} onChange={onChange} />
  }

  console.error('Unknown type of column:', column)
  return <div className={'alert alert-danger'}>Error: Unknown column type</div>
}
