import fetch from 'node-fetch'
import { getCache, setCache, getSingleCache, getAllCache } from './db/cache'
import { Types } from '../types/Components'
import type { StatusData } from '../types/OnlineStatus'
import type { Item } from '../types/Item'

const STATUS_TTL_MS = 10 * 60 * 1000
const POLL_INTERVAL_MS = 10 * 60 * 1000
const REFRESH_BATCH_SIZE = 10

let pollerStarted = false
let refreshInProgress = false
const inFlightItemRefreshes = new Set<string>()

function getStatusKey(itemId: string) {
  return Types.item + '_ping-' + itemId
}

function buildMissingUrlStatus(): StatusData {
  return {
    url: '',
    time: '0',
    status: 'noURL',
  }
}

async function resolveItem(itemId: string) {
  return (await getSingleCache(Types.item, itemId)) as Item | null
}

export async function getCachedItemStatus(itemId: string) {
  return (await getCache(getStatusKey(itemId))) as StatusData | null
}

export async function refreshItemStatus(itemId: string) {
  if (inFlightItemRefreshes.has(itemId)) {
    return
  }

  inFlightItemRefreshes.add(itemId)

  try {
    const item = await resolveItem(itemId)
    if (item === null) {
      return
    }

    if (!Array.isArray(item.urls) || item.urls.length === 0) {
      await setCache(getStatusKey(itemId), buildMissingUrlStatus())
      return
    }

    let response: Awaited<ReturnType<typeof fetch>>
    try {
      response = await fetch(item.urls[0], {
        method: 'HEAD',
        headers: {
          DNT: '1',
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache',
          Referer: 'https://theindex.moe',
        },
      })
    } catch (error) {
      await setCache(getStatusKey(itemId), {
        url: item.urls[0],
        time: Date.now().toString(),
        status: 'down',
      })
      return
    }

    const code = response.status
    const up = [200, 300, 301, 302, 307, 308]
    let status = 'down'

    const server =
      response.headers.get('Server') || response.headers.get('server')
    if (up.includes(code)) {
      status = 'up'
    } else if (server) {
      const unknown = [401, 403, 503, 520]
      if (
        (unknown.includes(code) && server === 'cloudflare') ||
        (code === 403 && server === 'ddos-guard')
      ) {
        status = 'unknown'
      }
    }

    await setCache(getStatusKey(itemId), {
      url: item.urls[0],
      time: Date.now().toString(),
      status,
    })
  } finally {
    inFlightItemRefreshes.delete(itemId)
  }
}

async function refreshItemsInBatches(items: Item[]) {
  let start = 0
  while (start < items.length) {
    const batch = items.slice(start, start + REFRESH_BATCH_SIZE)
    await Promise.all(batch.map((item) => refreshItemStatus(item._id)))
    start += REFRESH_BATCH_SIZE
  }
}

export async function refreshAllItemStatuses() {
  if (refreshInProgress) {
    return
  }

  refreshInProgress = true
  try {
    const items = (await getAllCache(Types.item)) as Item[]
    await refreshItemsInBatches(items)
  } finally {
    refreshInProgress = false
  }
}

export function ensureItemStatusPolling() {
  if (pollerStarted) {
    return
  }

  pollerStarted = true
  void refreshAllItemStatuses()
  const interval = setInterval(() => {
    void refreshAllItemStatuses()
  }, POLL_INTERVAL_MS)
  if (typeof interval.unref === 'function') {
    interval.unref()
  }
}

export async function getItemStatusResponse(itemId: string) {
  const cached = await getCachedItemStatus(itemId)
  if (cached === null) {
    const item = await resolveItem(itemId)
    if (item === null) {
      return null
    }

    if (!Array.isArray(item.urls) || item.urls.length === 0) {
      return buildMissingUrlStatus()
    }

    void refreshItemStatus(itemId)
    return {
      url: item.urls[0],
      time: '0',
      status: 'fetching',
    } as StatusData
  }

  if (Date.now() - parseInt(cached.time, 10) > STATUS_TTL_MS) {
    void refreshItemStatus(itemId)
  }

  return cached
}
