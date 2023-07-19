import React from 'react'
import DataItem from './data/DataItem'
import { ColumnType } from '../types/Column'

export default function ColumnFilter({ columns, filter, setFilter }) {
  const updateFilter = (column, value) => {
    if (
      (value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)) &&
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
      (column.type === ColumnType.feature && typeof value === 'boolean') ||
      (column.type === ColumnType.proAndCon && typeof value === 'boolean') ||
      (column.type === ColumnType.array && Array.isArray(value)) ||
      (column.type === ColumnType.language && Array.isArray(value)) ||
      (column.type === ColumnType.text && typeof value === 'string')
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

  const boolColumns = columns.filter(
    (column) => column.type === ColumnType.feature
  )
  const proAndConColumns = columns.filter(
    (column) => column.type === ColumnType.proAndCon
  )
  const arrayColumns = columns.filter(
    (column) => column.type === ColumnType.array
  )
  const languageColumns = columns.filter(
    (column) => column.type === ColumnType.language
  )
  /*
  const textColumns = columns.filter(
    (column) => column.type === ColumnType.text
  )
   */
  return (
    <div className={'d-flex flex-column'}>
      <h5>Features</h5>
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

      {proAndConColumns.length > 0 && (
        <>
          <hr />
          <h5>Pro and Cons</h5>
          <div className={'d-flex flex-wrap'}>
            {proAndConColumns.map((column) => (
              <span className={'me-2'} key={column._id}>
                <DataItem
                  data={filter[column._id]}
                  column={column}
                  onChange={(value) => updateFilter(column, value)}
                />
              </span>
            ))}
          </div>
        </>
      )}

      {arrayColumns.length > 0 && (
        <>
          <hr />
          <h5>Misc.</h5>
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
        </>
      )}

      {languageColumns.length > 0 && <hr />}
      {languageColumns.map((column) => (
        <div key={column._id}>
          <span className={'me-2'}>{column.name}:</span>
          <DataItem
            data={filter[column._id]}
            column={column}
            onChange={(value) => updateFilter(column, value)}
          />
        </div>
      ))}

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
    </div>
  )
}
