import { useEffect, useState } from 'react'
import type { StatusData } from '../types/OnlineStatus'

type CachedStatus = {
  data: StatusData | null
  fetchedAt: number
}

type Listener = (data: StatusData | null) => void

const CLIENT_CACHE_TTL_MS = 30 * 1000
const BATCH_WINDOW_MS = 16

const cache = new Map<string, CachedStatus>()
const listeners = new Map<string, Set<Listener>>()
const pendingIds = new Set<string>()
let flushTimer: ReturnType<typeof setTimeout> | null = null

function getCachedStatus(itemId: string) {
  const cached = cache.get(itemId)
  if (!cached) {
    return null
  }

  if (Date.now() - cached.fetchedAt > CLIENT_CACHE_TTL_MS) {
    return null
  }

  return cached.data
}

function emit(itemId: string, data: StatusData | null) {
  const itemListeners = listeners.get(itemId)
  if (!itemListeners) {
    return
  }

  itemListeners.forEach((listener) => listener(data))
}

function subscribe(itemId: string, listener: Listener) {
  const itemListeners = listeners.get(itemId) ?? new Set<Listener>()
  itemListeners.add(listener)
  listeners.set(itemId, itemListeners)

  return () => {
    const currentListeners = listeners.get(itemId)
    if (!currentListeners) {
      return
    }

    currentListeners.delete(listener)
    if (currentListeners.size === 0) {
      listeners.delete(itemId)
    }
  }
}

async function flushPendingIds() {
  const ids = Array.from(pendingIds)
  pendingIds.clear()
  flushTimer = null

  if (ids.length === 0) {
    return
  }

  try {
    const response = await fetch('/api/item/ping?ids=' + ids.join(','))
    if (response.status !== 200) {
      throw new Error('Failed to fetch item status batch')
    }

    const data = (await response.json()) as Record<string, StatusData | null>
    ids.forEach((itemId) => {
      const status = Object.prototype.hasOwnProperty.call(data, itemId)
        ? data[itemId]
        : null
      cache.set(itemId, {
        data: status,
        fetchedAt: Date.now(),
      })
      emit(itemId, status)
    })
  } catch (error) {
    console.error('Failed to fetch batched item statuses', error)
    ids.forEach((itemId) => emit(itemId, cache.get(itemId)?.data ?? null))
  }
}

function queueItemStatus(itemId: string) {
  if (!itemId) {
    return
  }

  pendingIds.add(itemId)
  if (flushTimer !== null) {
    return
  }

  flushTimer = setTimeout(() => {
    void flushPendingIds()
  }, BATCH_WINDOW_MS)
}

export function useItemStatus(itemId: string, fallbackData?: StatusData | null) {
  const [data, setData] = useState<StatusData | null>(() => {
    if (fallbackData) {
      cache.set(itemId, {
        data: fallbackData,
        fetchedAt: Date.now(),
      })
      return fallbackData
    }

    return getCachedStatus(itemId)
  })

  useEffect(() => {
    if (!itemId) {
      return
    }

    if (fallbackData) {
      cache.set(itemId, {
        data: fallbackData,
        fetchedAt: Date.now(),
      })
      setData(fallbackData)
    } else {
      const cached = getCachedStatus(itemId)
      if (cached) {
        setData(cached)
      } else {
        queueItemStatus(itemId)
      }
    }

    return subscribe(itemId, setData)
  }, [fallbackData, itemId])

  return data
}
