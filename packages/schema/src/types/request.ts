import type { CuratedPeriod, NewsItem } from './news'

export interface NewsListRequest {
  category?: string
  source?: string
  ingest_date?: string
  limit?: number
  offset?: number
}

export interface NewsListResponse {
  total: number
  limit: number
  offset: number
  items: NewsItem[]
}

export interface CuratedNewsRequest {
  period: CuratedPeriod
  limit?: number
  offset?: number
}

export interface CuratedNewsResponse extends NewsListResponse {
  period: CuratedPeriod
}
