const itemReturnPathPrefix = 'item-return-path:'

function getItemReturnPathKey(itemId: string) {
  return itemReturnPathPrefix + itemId
}

export function setItemReturnPath(itemId: string, path: string) {
  if (typeof window === 'undefined') {
    return
  }

  if (
    typeof itemId !== 'string' ||
    itemId === '' ||
    typeof path !== 'string' ||
    !path.startsWith('/')
  ) {
    return
  }

  window.sessionStorage.setItem(getItemReturnPathKey(itemId), path)
}

export function getItemReturnPath(itemId: string) {
  if (typeof window === 'undefined') {
    return null
  }

  return window.sessionStorage.getItem(getItemReturnPathKey(itemId))
}
