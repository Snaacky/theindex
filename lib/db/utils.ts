import { ObjectId } from 'mongodb'
import { hasOwnProperty } from '../utils'

export function cleanId(data: Record<string, any>) {
  if (typeof data !== 'undefined' && data !== null) {
    if (Array.isArray(data)) {
      return data.map((d) => cleanId(d))
    }
    if (hasOwnProperty(data, '_id')) {
      data._id = (data._id as number).toString()
    }
    if (hasOwnProperty(data, 'lastModified')) {
      data.lastModified = (data.lastModified as Date).toString()
    }
    if (hasOwnProperty(data, 'createdAt')) {
      data.createdAt = (data.createdAt as Date).toString()
    }
  }
  return data
}
export function polluteId(query: Record<string, any>) {
  if (typeof query !== 'undefined') {
    if (hasOwnProperty(query, '_id') && typeof query._id === 'string') {
      query._id = new ObjectId(query._id)
    }
    if (
      hasOwnProperty(query, 'lastModified') &&
      typeof query.lastModified === 'string'
    ) {
      query.lastModified = new Date(query.lastModified)
    }
  }
  return query
}
