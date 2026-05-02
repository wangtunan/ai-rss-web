import type { CuratedNewsRequest, CuratedNewsResponse, NewsListRequest, NewsListResponse } from '@/types/news'
import { fetchJson } from '@/api/common/json'

const STATIC_NEWS_LIST_BASE_URL = import.meta.env.VITE_STATIC_NEWS_LIST_BASE_URL ?? '/data/news'

export const fetchStaticNewsList = async (params: NewsListRequest): Promise<NewsListResponse> => {
  const category = params.category ?? 'all'
  return fetchJson<NewsListResponse>(`${STATIC_NEWS_LIST_BASE_URL}/${category}.json`)
}

export const fetchStaticCuratedNews = async (params: CuratedNewsRequest): Promise<CuratedNewsResponse> => {
  return fetchJson<CuratedNewsResponse>(`${STATIC_NEWS_LIST_BASE_URL}/curated-${params.period}.json`)
}
