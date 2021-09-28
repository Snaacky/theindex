import React from 'react'

export default class ColumnFilter extends React.Component {
  constructor({ columns, onChange }) {
    super({ columns, onChange })

    if (!columns) {
      console.error('No columns definition provided for ColumnFilter', columns)
    }
    this.columns = columns
    this.filter = []

    if (typeof onChange !== 'function') {
      console.error('No columns definition provided for ColumnFilter', onChange)
    }
    this.onChange = onChange
  }

  render() {
    return <></>
  }
}
