export function splitColumnsIntoTypes(columns, itemData) {
  if (itemData.data) {
    itemData = itemData.data
  }

  let yes = [],
    no = [],
    array = [],
    text = []
  columns.forEach((c) => {
    if (typeof c === 'undefined' || c === null) {
      console.warn('Impossible column data', c, 'skipping...')
      return
    }

    if (c.type === 'bool') {
      if (itemData[c._id] === true) {
        yes.push(c)
      } else if (itemData[c._id] === false) {
        no.push(c)
      }
    } else if (c.type === 'array' && (itemData[c._id] || []).length > 0) {
      array.push(c)
    } else if (c.type === 'text') {
      text.push(c)
    }
  })

  return {
    yes,
    no,
    array,
    text,
  }
}
