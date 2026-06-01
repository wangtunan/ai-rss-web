import type { CuratedNewsResponse, NewsListResponse } from '@ai-rss/schema'

import allNewsPayload from '@/data/news/all.json'
import curatedTodayPayload from '@/data/news/curated-today.json'

export const fetchStaticCuratedToday = async (): Promise<CuratedNewsResponse> => {
  return curatedTodayPayload as CuratedNewsResponse
}

export const fetchStaticAllNews = async (): Promise<NewsListResponse> => {
  return allNewsPayload as NewsListResponse
}
