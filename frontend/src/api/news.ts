import type { NewsResponse, NewsListResponse, NewsListRequest } from '@/types/news'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const fetchNewsPayload = async (): Promise<NewsResponse> => {
  const url = `${API_BASE_URL}/api/v1/news?limit=200`
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`数据加载失败: ${response.status}`)
  }
  const result = await response.json()

  return result as NewsResponse
}

export const fetchNewsListPayload = async (params: NewsListRequest): Promise<NewsListResponse> => {
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
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`数据加载失败: ${response.status}`)
  }
  const result = await response.json()
  return result as NewsListResponse
}
