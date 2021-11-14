import React from 'react'
import DataItem from './data/DataItem'

export default function ColumnFilter({ columns, filter, setFilter }) {
  const updateFilter = (column, value) => {
    if (
      (value === null || value === '' || value === []) &&
      typeof filter[column._id] !== 'undefined'
    ) {
      let temp = {}
      Object.keys(filter).forEach((key) => {
        if (key !== column._id) {
          temp[key] = filter[key]
        }
      })
      console.log('Deleting', column._id)
      setFilter(temp)
    } else if (
      (column.type === 'bool' && typeof value === 'boolean') ||
      (column.type === 'array' && Array.isArray(value)) ||
      (column.type === 'text' && typeof value === 'string')
    ) {
      let temp = {}
      let keys = Object.keys(filter)
      if (!keys.includes(column._id)) {
        keys.push(column._id)
      }
      keys.forEach((key) => {
        if (key !== column._id) {
          temp[key] = filter[key]
        } else {
          temp[key] = value
        }
      })

      setFilter(temp)
    }
  }

  const boolColumns = columns.filter((column) => column.type === 'bool')
  const textColumns = columns.filter((column) => column.type === 'text')
  const arrayColumns = columns.filter((column) => column.type === 'array')
  return (
    <div className={'d-flex flex-column'}>
      <div className={'d-flex flex-wrap'}>
        {boolColumns.map((column) => (
          <span className={'me-2'} key={column._id}>
            <DataItem
              data={filter[column._id]}
              column={column}
              onChange={(value) => updateFilter(column, value)}
            />
          </span>
        ))}
      </div>

      {/* // leaving this here for text field search support
      {textColumns.length > 0 && <hr />}
      <div className={'d-flex flex-wrap'}>
        {textColumns.map((column) => (
          <div key={column._id}>
            <span>{column.name}</span>
            <DataItem
              data={filter[column._id]}
              key={column._id}
              column={column}
              onChange={(value) => updateFilter(column, value)}
            />
          </div>
        ))}
      </div>*/}

      {arrayColumns.length > 0 && <hr />}
      {arrayColumns.map((column) => (
        <div key={column._id}>
          <span className={'me-2'}>{column.name}:</span>
          <DataItem
            data={filter[column._id]}
            column={column}
            onChange={(value) => updateFilter(column, value)}
          />
        </div>
      ))}
    </div>
  )
}
