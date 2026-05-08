import type { FetchLike } from '../types/index'
import { StaticNewsRequestError } from '../errors/index'

export const getFetch = (fetcher?: FetchLike): FetchLike => {
  if (fetcher) return fetcher
  if (typeof globalThis.fetch === 'function') return globalThis.fetch.bind(globalThis)
  throw new StaticNewsRequestError('globalThis.fetch', 'No fetch implementation is available')
}

export const fetchJson = async <T>(fetcher: FetchLike, url: string): Promise<T> => {
  let response: Response

  try {
    response = await fetcher(url)
  } catch (error) {
    throw new StaticNewsRequestError(url, 'request failed', error)
  }

  if (!response.ok) {
    throw new StaticNewsRequestError(url, `HTTP ${response.status}`)
  }

  try {
    return (await response.json()) as T
  } catch (error) {
    throw new StaticNewsRequestError(url, 'invalid JSON response', error)
  }
}