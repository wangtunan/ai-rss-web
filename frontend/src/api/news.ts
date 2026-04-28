import type { CuratedNewsRequest, CuratedNewsResponse, NewsListResponse, NewsListRequest } from '@/types/news'
import { fetchJson } from './json'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const DATA_MODE = import.meta.env.VITE_DATA_MODE ?? 'api'
const STATIC_NEWS_LIST_BASE_URL = import.meta.env.VITE_STATIC_NEWS_LIST_BASE_URL ?? '/data/news'

const isStaticMode = () => DATA_MODE === 'static'

export const fetchNewsListPayload = async (params: NewsListRequest): Promise<NewsListResponse> => {
  if (isStaticMode()) {
    const category = params.category ?? 'all'
    const url = `${STATIC_NEWS_LIST_BASE_URL}/${category}.json`
    return fetchJson<NewsListResponse>(url)
  }

  const queryParams = new URLSearchParams()
  if (params.category) {
    queryParams.set('category', params.category)
  }
  if (params.source) {
    queryParams.set('source', params.source)
  }
  if (params.ingest_date) {
    queryParams.set('ingest_date', params.ingest_date)
  }

  queryParams.set('limit', String(params.limit ?? 200))
  queryParams.set('offset', String(params.offset ?? 0))

  const url = `${API_BASE_URL}/api/v1/news/list?${queryParams.toString()}`
  return fetchJson<NewsListResponse>(url)
}

export const fetchCuratedNewsPayload = async (params: CuratedNewsRequest): Promise<CuratedNewsResponse> => {
  if (isStaticMode()) {
    const url = `${STATIC_NEWS_LIST_BASE_URL}/curated-${params.period}.json`
    return fetchJson<CuratedNewsResponse>(url)
  }

  const queryParams = new URLSearchParams()
  queryParams.set('period', params.period)
  queryParams.set('scope', params.scope ?? 'all')
  queryParams.set('limit', String(params.limit ?? 20))
  queryParams.set('offset', String(params.offset ?? 0))

  const url = `${API_BASE_URL}/api/v1/news/curated?${queryParams.toString()}`
  return fetchJson<CuratedNewsResponse>(url)
}
