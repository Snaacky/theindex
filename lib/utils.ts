import { toast } from 'react-toastify'
import { Types } from '../types/Components'
import { iso6393 } from 'iso-639-3'

export function isValidUrl(url = '') {
  if (typeof url === 'string') {
    // hell of a regex from @diegoperini, taken from https://mathiasbynens.be/demo/url-regex, note e.g. \x{ffff} is converted to \uffff
    return !!url.match(
      /^https?:\/\/(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4])|(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*\.[a-z\u00a1-\uffff]{2,})(?::\d{2,5})?(?:\/[^\s]*)?$/
    )
  }
  return false
}

export function postData(url, object, onSuccess = null) {
  const toastId = toast.loading('Saving changes...')
  fetch(url, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(object),
  }).then(async (r) => {
    if (r.status !== 200) {
      toast.update(toastId, {
        render: 'Failed to save changes',
        type: 'error',
        isLoading: false,
        autoClose: 1000,
      })
    } else {
      toast.update(toastId, {
        render: 'Saved changes',
        type: 'success',
        isLoading: false,
        autoClose: 1000,
      })
      if (typeof onSuccess === 'function') {
        onSuccess(await r.text())
      }
    }
  })
}

export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop)
}

export function singularToPlural(type: Types) {
  if (type === Types.item) {
    return 'items'
  } else if (type === Types.column) {
    return 'columns'
  } else if (type === Types.collection) {
    return 'collections'
  } else if (type === Types.library) {
    return 'libraries'
  } else if (type === Types.user) {
    return 'users'
  } else if (type === Types.list) {
    return 'lists'
  } else {
    throw 'Unknown type: ' + type
  }
}

export function getLanguages() {
  const whitelist = []
  return iso6393.filter(
    (lang) =>
      lang.type === 'living' &&
      lang.scope === 'individual' &&
      (typeof lang.iso6391 !== 'undefined' || whitelist.includes(lang.iso6393))
  )
}
