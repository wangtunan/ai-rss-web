import type { CuratedNewsRequest, CuratedNewsResponse, NewsListRequest, NewsListResponse } from '@/types/news'
import { fetchStaticCuratedNews, fetchStaticNewsList } from './static_news'
import { fetchSupabaseCuratedNews, fetchSupabaseNewsList } from './supabase_news'

const DATA_MODE = import.meta.env.VITE_DATA_MODE ?? 'static'

// 按Category分类获取新闻列表
export const fetchNewsListPayload = (params: NewsListRequest): Promise<NewsListResponse> => {
  if (DATA_MODE === 'static') {
    return fetchStaticNewsList(params)
  } else if (DATA_MODE === 'supabase') {
    return fetchSupabaseNewsList(params)
  } else {
    throw new Error(`Unsupported data mode: ${DATA_MODE}`)
  }
}

// 获取精选新闻
export const fetchCuratedNewsPayload = (params: CuratedNewsRequest): Promise<CuratedNewsResponse> => {
  if (DATA_MODE === 'static') {
    return fetchStaticCuratedNews(params)
  } else if (DATA_MODE === 'supabase') {
    return fetchSupabaseCuratedNews(params)
  } else {
    throw new Error(`Unsupported data mode: ${DATA_MODE}`)
  }
}
