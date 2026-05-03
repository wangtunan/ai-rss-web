import type { CuratedNewsRequest, CuratedNewsResponse, NewsItem, NewsListRequest, NewsListResponse } from '@/types/news'
import { supabase } from '@/utils/supabase'

const NEWS_TABLE = 'public_news_items'

// 按Category分类获取新闻列表
export const fetchSupabaseNewsList = async (params: NewsListRequest): Promise<NewsListResponse> => {
  const limit = params.limit ?? 200
  const offset = params.offset ?? 0

  let query = supabase
    .from(NEWS_TABLE)
    .select('*', { count: 'exact' })
    .order('published_time', { ascending: false, nullsFirst: false })
    .order('ai_importance', { ascending: false })
    .order('id', { ascending: false })
    .range(offset, offset + limit - 1)

  if (params.category) query = query.eq('category', params.category)
  if (params.source) query = query.eq('source', params.source)
  if (params.ingest_date) query = query.eq('ingest_date', params.ingest_date)

  const { data, count, error } = await query
  if (error) throw new Error(`Supabase query failed: ${error.message}`)

  return {
    total: count ?? 0,
    limit,
    offset,
    items: data ?? [],
  }
}

/** 精选：按 ai_importance 降序返回最新 Top N */
export const fetchSupabaseCuratedNews = async (params: CuratedNewsRequest): Promise<CuratedNewsResponse> => {
  const limit = params.limit ?? 20
  const offset = params.offset ?? 0

  const { data, count, error } = await supabase
    .from(NEWS_TABLE)
    .select('*', { count: 'exact' })
    .order('ai_importance', { ascending: false })
    .order('published_time', { ascending: false, nullsFirst: false })
    .order('id', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw new Error(`Supabase query failed: ${error.message}`)

  return {
    period: params.period,
    total: count ?? 0,
    limit,
    offset,
    items: data ?? [],
  }
}
