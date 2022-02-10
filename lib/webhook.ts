import { Item } from '../types/Item'
import { getAllCache } from './db/cache'
import { Types } from '../types/Components'
import { Column, ColumnType } from '../types/Column'
import { User } from '../types/User'
import { getLanguages } from './utils'

const extractFieldsFromItemDataDiff = async (oldItem: Item, newItem: Item) => {
  const languages = getLanguages()
  const columns = (await getAllCache(Types.column)) as Column[]
  const data: Record<string, { column: Column; old: any; updated: any }> = {}
  if (oldItem !== null) {
    const oldKeys = Object.keys(oldItem.data)
    oldKeys.forEach((key) => {
      if (newItem !== null && key in newItem.data) {
        data[key] = {
          column: columns.find((column) => column._id === key),
          old: oldItem.data[key],
          updated: newItem !== null ? newItem.data[key] : null,
        }
      } else {
        data[key] = {
          column: columns.find((column) => column._id === key),
          old: oldItem.data[key],
          updated: null,
        }
      }
    })
    if (newItem !== null) {
      Object.keys(newItem.data)
        .filter((key) => !oldKeys.includes(key))
        .forEach((key) => {
          data[key] = {
            column: columns.find((column) => column._id === key),
            old: null,
            updated: newItem.data[key],
          }
        })
    }
  } else {
    Object.keys(newItem.data).forEach((key) => {
      data[key] = {
        column: columns.find((column) => column._id === key),
        old: null,
        updated: newItem.data[key],
      }
    })
  }

  const result = Object.keys(data).map((key) => data[key])
  result.unshift({
    old: oldItem !== null && oldItem.urls.length > 0 ? oldItem.urls : null,
    updated: newItem !== null && newItem.urls.length > 0 ? newItem.urls : null,
    column: {
      type: ColumnType.array,
      name: 'URLs',
    } as unknown as Column,
  })

  result.unshift({
    old:
      oldItem !== null && oldItem.description.length > 0
        ? oldItem.description
        : null,
    updated:
      newItem !== null && newItem.description.length > 0
        ? newItem.description
        : null,
    column: {
      type: ColumnType.text,
      name: 'Description',
    } as unknown as Column,
  })

  return result
    .filter((result) => {
      if (typeof result.old !== typeof result.updated) {
        return true
      }

      if (!Array.isArray(result.old)) {
        return result.old !== result.updated
      }

      if (result.old.length !== result.updated.length) {
        return true
      }

      return result.old.some((value, index) => result.updated[index] !== value)
    })
    .map(({ column, old, updated }) => {
      let oldValue, newValue
      if (old !== null) {
      }
      switch (column.type) {
        case ColumnType.feature:
          oldValue = old !== null ? old : null
          newValue = updated !== null ? updated : null
          break
        case ColumnType.proAndCon:
          oldValue = old !== null ? column.values[old ? 0 : 1] : null
          newValue = updated !== null ? column.values[updated ? 0 : 1] : null
          break
        case ColumnType.language:
          oldValue =
            old !== null && old.length > 0
              ? old.map(
                  (langKey) =>
                    languages.find((lang) => lang.iso6393 === langKey).name
                )
              : null
          newValue =
            updated !== null && updated.length > 0
              ? updated.map(
                  (langKey) =>
                    languages.find((lang) => lang.iso6393 === langKey).name
                )
              : null
          break
        case ColumnType.array:
          oldValue = old !== null && old.length > 0 ? old : null
          newValue = updated !== null && updated.length > 0 ? updated : null
          break
        case ColumnType.text:
          oldValue = old !== null && old.length > 0 ? old : null
          newValue = updated !== null && updated.length > 0 ? updated : null
          break
        default:
          throw new Error('Impossible column type: ' + column.type)
      }

      return {
        name: column.name,
        value:
          '```diff\n' +
          (oldValue !== null ? '- ' + JSON.stringify(oldValue) + '\n' : '') +
          (newValue !== null ? '+ ' + JSON.stringify(newValue) + '\n' : '') +
          '```',
      }
    })
}

export const postItemUpdate = async (
  user: User,
  oldItem: Item | null,
  newItem: Item | null
) => {
  if (!('AUDIT_WEBHOOK' in process.env) || process.env.AUDIT_WEBHOOK === '') {
    return
  }

  const url = process.env.AUDIT_WEBHOOK

  let title = '',
    color
  if (newItem !== null && oldItem !== null) {
    if (newItem.name !== oldItem.name) {
      title = 'Renamed: ' + oldItem.name + ' -> ' + newItem.name
    } else {
      title = 'Updated: ' + newItem.name
    }
    color = 2303786 // nearly black
  } else if (oldItem !== null) {
    title = 'Deleted: ' + oldItem.name
    color = 15548997 // red
  } else if (newItem !== null) {
    title = 'Created: ' + newItem.name
    color = 5763719 // green
  } else {
    throw Error(
      'Impossible to post webhook update if oldItem and newItem are both null'
    )
  }

  fetch(url, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'Index Feed',
      avatar_url: process.env.NEXT_PUBLIC_DOMAIN + '/icons/logo.png',
      embeds: [
        {
          title,
          url:
            process.env.NEXT_PUBLIC_DOMAIN +
            (newItem !== null ? '/item/' + newItem._id : '/items'),
          color,
          author: {
            name: user.name,
            icon_url: user.image,
          },
          fields: await extractFieldsFromItemDataDiff(oldItem, newItem),
        },
      ],
    }),
  }).then((r) => {
    if (![200, 201, 202, 204].includes(r.status)) {
      console.error(
        'Something went wrong when posting to webhook',
        r.status,
        r.statusText
      )
    }
  })
}

export const postItemSubmission = async (
  user: User,
  oldItem: Item | null,
  newItem: Item | null
) => {
  if (!('AUDIT_WEBHOOK' in process.env) || process.env.AUDIT_WEBHOOK === '') {
    return
  }

  const url = process.env.AUDIT_WEBHOOK + '?wait=true'

  let title = '',
    color
  if (newItem !== null && oldItem !== null) {
    title = 'Requested change: '
    if (newItem.name !== oldItem.name) {
      title += oldItem.name + ' -> ' + newItem.name
    } else {
      title += newItem.name
    }
    color = 2303786 // nearly black
  } else if (oldItem !== null) {
    title = 'Requested deletion: ' + oldItem.name
    color = 15548997 // red
  } else if (newItem !== null) {
    title = 'Requested new entry: ' + newItem.name
    color = 5763719 // green
  } else {
    throw Error(
      'Impossible to post webhook update if oldItem and newItem are both null'
    )
  }

  fetch(url, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'Index Submissions',
      avatar_url: process.env.NEXT_PUBLIC_DOMAIN + '/icons/logo.png',
      embeds: [
        {
          title,
          description: 'This is a submission for correction/entry of data',
          url: process.env.NEXT_PUBLIC_DOMAIN + '/item/' + newItem._id,
          color,
          author: {
            name: user.name,
            icon_url: user.image,
          },
          fields: await extractFieldsFromItemDataDiff(oldItem, newItem),
        },
      ],
      components: [
        {
          type: 2,
          style: 5,
          label: 'Moderate',
          url: process.env.NEXT_PUBLIC_DOMAIN + '/edit/item/' + newItem._id,
        },
      ],
    }),
  })
    .then((r) => {
      if (![200, 201, 202, 204].includes(r.status)) {
        console.error(
          'Something went wrong when posting to webhook',
          r.status,
          r.statusText
        )
      }
      return r.json()
    })
    .then((data) => {
      try {
        const { id, webhook_id, channel_id } = data
        console.log(
          'Message has id:',
          id,
          'webhook:',
          webhook_id,
          'in channel:',
          channel_id
        )
      } catch (e) {
        console.error('Failed to destructure response', data)
      }
    })
}
