import FeatureValue from './FeatureValue'
import ArrayValue from './ArrayValue'
import TextValue from './TextValue'
import { Column, ColumnType } from '../../types/Column'
import ProAndConValue from './ProAndConValue'
import { FC } from 'react'
import LanguageValue from './LanguageValue'

type Props = {
  data: boolean | string | string[] | null
  column: Column
  onChange?: (data: any) => void
}

const DataItem: FC<Props> = ({ data, column, onChange = null }) => {
  const isUndefined = typeof data === 'undefined' || data === null
  if (
    column.type === ColumnType.feature &&
    (typeof data === 'boolean' || isUndefined) &&
    !Array.isArray(data) &&
    typeof data !== 'string'
  ) {
    return <FeatureValue data={data} column={column} onChange={onChange} />
  } else if (
    column.type === ColumnType.proAndCon &&
    (typeof data === 'boolean' || isUndefined) &&
    !Array.isArray(data) &&
    typeof data !== 'string'
  ) {
    return <ProAndConValue data={data} column={column} onChange={onChange} />
  } else if (
    column.type === ColumnType.array &&
    (Array.isArray(data) || isUndefined) &&
    typeof data !== 'boolean' &&
    typeof data !== 'string'
  ) {
    return <ArrayValue data={data || []} column={column} onChange={onChange} />
  } else if (
    column.type === ColumnType.language &&
    (Array.isArray(data) || isUndefined) &&
    typeof data !== 'boolean' &&
    typeof data !== 'string'
  ) {
    return (
      <LanguageValue data={data || []} column={column} onChange={onChange} />
    )
  } else if (
    column.type === ColumnType.text &&
    (typeof data === 'string' || isUndefined) &&
    !Array.isArray(data)
  ) {
    return <TextValue data={data || ''} column={column} onChange={onChange} />
  }

  console.error('Unknown type of column or data:', column, typeof data)
  return <div className={'alert alert-danger'}>Error: Unknown column type</div>
}

export default DataItem
