import { ColumnType } from '../types/Column'

export function splitColumnsIntoTypes(columns, itemData) {
  if (itemData.data) {
    itemData = itemData.data
  }

  let features = [],
    pro = [],
    con = [],
    array = [],
    text = []
  columns.forEach((c) => {
    if (typeof c === 'undefined' || c === null) {
      console.warn('Impossible column data', c, 'skipping...')
      return
    }

    if (c.type === ColumnType.feature) {
      if (itemData[c._id] === true) {
        features.push(c)
      }
    } else if (
      (c.type === ColumnType.array || c.type === ColumnType.language) &&
      (itemData[c._id] || []).length > 0
    ) {
      array.push(c)
    } else if (c.type === ColumnType.proAndCon) {
      if (itemData[c._id] === true) {
        pro.push(c)
      } else if (itemData[c._id] === false) {
        con.push(c)
      }
    } else if (c.type === ColumnType.text) {
      text.push(c)
    }
  })

  return {
    features,
    pro,
    con,
    array,
    text,
  }
}
