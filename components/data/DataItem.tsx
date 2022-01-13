import BoolValue from './BoolValue'
import ArrayValue from './ArrayValue'
import TextValue from './TextValue'
import { Column, ColumnType } from '../../types/Column'
import ProAndConValue from './ProAndConValue'
import { FC } from 'react'

type Props = {
  data: boolean | string[] | null
  column: Column
  onChange?: (data: boolean | null) => void
}

const DataItem: FC<Props> = ({ data, column, onChange = null }) => {
  if (column.type === ColumnType.boolean && !Array.isArray(data)) {
    return <BoolValue data={data} column={column} onChange={onChange} />
  } else if (column.type === ColumnType.proAndCon && !Array.isArray(data)) {
    return <ProAndConValue data={data} column={column} onChange={onChange} />
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

export default DataItem
