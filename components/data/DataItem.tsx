import FeatureValue from './FeatureValue'
import ArrayValue from './ArrayValue'
import TextValue from './TextValue'
import { Column, ColumnType } from '../../types/Column'
import ProAndConValue from './ProAndConValue'
import { FC } from 'react'

type Props = {
  data: boolean | string[] | null
  column: Column
  onChange?: (data: any) => void
}

const DataItem: FC<Props> = ({ data, column, onChange = null }) => {
  if (
    column.type === ColumnType.feature &&
    !Array.isArray(data) &&
    typeof data !== 'string'
  ) {
    return <FeatureValue data={data} column={column} onChange={onChange} />
  } else if (column.type === ColumnType.proAndCon && !Array.isArray(data)) {
    return <ProAndConValue data={data} column={column} onChange={onChange} />
  } else if (
    (column.type === ColumnType.array || column.type === ColumnType.language) &&
    typeof data !== 'boolean' &&
    typeof data !== 'string'
  ) {
    return <ArrayValue data={data || []} column={column} onChange={onChange} />
  } else if (
    column.type === ColumnType.text &&
    !Array.isArray(data) &&
    typeof data !== 'boolean'
  ) {
    return <TextValue data={data || ''} column={column} onChange={onChange} />
  }

  console.error('Unknown type of column:', column)
  return <div className={'alert alert-danger'}>Error: Unknown column type</div>
}

export default DataItem
