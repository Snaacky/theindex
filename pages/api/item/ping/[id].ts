import { getCache, getSingleCache, setCache } from '../../../../lib/db/cache'
import { Types } from '../../../../types/Components'
import { NextApiRequest, NextApiResponse } from 'next'
import { StatusData } from '../../../../types/OnlineStatus'
import { Item } from '../../../../types/Item'
import { SocksProxyAgent } from 'socks-proxy-agent'
import fetch, { Response } from 'node-fetch'

export default async function apiItemPing(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = (await getCache(
    Types.item + '_ping-' + req.query.id
  )) as StatusData | null

  if (data === null) {
    const item = (await getSingleCache(
      Types.item,
      req.query.id as string
    )) as Item | null

    if (item === null) {
      return res.status(404)
    }

    let status: StatusData
    if (!Array.isArray(item.urls) || item.urls.length === 0) {
      status = {
        url: '',
        time: '0',
        status: 'noURL',
      }
    } else {
      status = {
        url: item.urls[0],
        time: '0',
        status: 'fetching',
      }

      // no await as this should be processed in the background
      triggerPingUpdate(req.query.id as string)
    }

    return res.status(200).json(status)
  } else if (Date.now() - parseInt(data.time) > 300) {
    // no await as this should be processed in the background
    triggerPingUpdate(req.query.id as string)
  }

  res.json(data)
}

async function triggerPingUpdate(itemId: string) {
  const item = (await getSingleCache(Types.item, itemId)) as Item | null

  if (item === null) {
    return console.error(
      'Called triggerPingUpdate of',
      itemId,
      'but no item could be found'
    )
  } else if (!Array.isArray(item.urls) || item.urls.length === 0) {
    return console.error(
      'Called triggerPingUpdate of',
      itemId,
      'but item has no urls',
      item.urls
    )
  }

  try {
    let res: Response

    if (!('SOCKS_PROXY' in process.env) || process.env.SOCKS_PROXY === '') {
      console.warn(
        'env SOCKS_PROXY missing. Set env to enable proxy for ping service'
      )

      res = await fetch(item.urls[0], {
        method: 'HEAD',
        headers: {
          DNT: '1',
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache',
          Referer: 'https://theindex.moe',
        },
      })
    } else {
      res = await fetch(item.urls[0], {
        method: 'HEAD',
        agent: new SocksProxyAgent(process.env.SOCKS_PROXY),
        headers: {
          DNT: '1',
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache',
          Referer: 'https://theindex.moe',
        },
      })
    }

    const code = res.status
    const up = [200, 300, 301, 302, 307, 308]
    let status = 'down'

    const server = res.headers.get('Server') || res.headers.get('server')
    if (up.includes(code)) {
      status = 'up'
    } else if (server) {
      const unknown = [401, 403, 503, 520]
      const forbidden = 403
      if (
        (unknown.includes(code) && server === 'cloudflare') ||
        (forbidden === code && server === 'ddos-guard')
      ) {
        status = 'unknown'
      }
    }

    console.log('Ping status of', item.urls[0], status)
    await setCache(Types.item + '_ping-' + itemId, {
      url: item.urls[0],
      time: Date.now().toString(),
      status,
    })
  } catch (e) {
    if ('PING_DEBUG' in process.env && process.env.PING_DEBUG === 'true') {
      console.error(
        'Failed to ping',
        item.urls[0],
        'due to the reason:',
        e.type,
        e
      )
    }
  }
  if (!('SOCKS_PROXY' in process.env) || process.env.SOCKS_PROXY === '') {
    console.warn('env SOCKS_PROXY missing. Set env to enable the ping service')
  }
}
