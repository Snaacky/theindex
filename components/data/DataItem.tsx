import FeatureValue from './FeatureValue'
import ArrayValue from './ArrayValue'
import TextValue from './TextValue'
import { Column, ColumnType } from '../../types/Column'
import ProAndConValue from './ProAndConValue'
import { FC } from 'react'
import LanguageValue from './LanguageValue'

type Props = {
  data?: boolean | string | string[]
  column: Column
  onChange?: (data: any) => void
}

function parseDataToBooleanOrUndefined(
  input: boolean | string | string[] | undefined | null
) {
  if (typeof input === 'boolean' || typeof input === 'undefined') {
    return input
  }
  if (input === null) {
    return undefined
  }
  if (input.length === 0) {
    return undefined
  }
  return true
}

function parseDataToArray(
  input: boolean | string | string[] | undefined | null
) {
  if (input === null || typeof input === 'undefined') {
    return []
  }
  if (typeof input === 'boolean') {
    return []
  }
  if (Array.isArray(input)) {
    return input
  }
  if (input.length > 0) {
    return [input]
  }
  return []
}

function parseDataToString(
  input: boolean | string | string[] | undefined | null
) {
  if (typeof input !== 'string') {
    return ''
  }
  return input
}

const DataItem: FC<Props> = ({ data, column, onChange }) => {
  const isUndefined = typeof data === 'undefined' || data === null
  if (column.type === ColumnType.feature) {
    return (
      <FeatureValue
        data={parseDataToBooleanOrUndefined(data)}
        column={column}
        onChange={onChange}
      />
    )
  } else if (column.type === ColumnType.proAndCon) {
    return (
      <ProAndConValue
        data={parseDataToBooleanOrUndefined(data)}
        column={column}
        onChange={onChange}
      />
    )
  } else if (column.type === ColumnType.array) {
    return (
      <ArrayValue
        data={parseDataToArray(data)}
        column={column}
        onChange={onChange}
      />
    )
  } else if (column.type === ColumnType.language) {
    return (
      <LanguageValue
        data={parseDataToArray(data)}
        column={column}
        onChange={onChange}
      />
    )
  } else if (column.type === ColumnType.text) {
    return (
      <TextValue
        data={parseDataToString(data)}
        column={column}
        onChange={onChange}
      />
    )
  }

  console.error('Unknown type of column or data:', column, typeof data, data)
  return <div className={'alert alert-danger'}>Error: Unknown column type</div>
}

export default DataItem
