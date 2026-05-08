import type { NewsItem, NewsListRequest, NewsListResponse } from '@ai-rss/schema'

import type { SearchNewsRequest } from '../types'
import { DEFAULT_SEARCH_FIELDS } from '../constants'

export const applyNewsListFilters = (response: NewsListResponse, params: NewsListRequest = {}): NewsListResponse => {
  const offset = params.offset ?? response.offset ?? 0
  const limit = params.limit ?? response.limit ?? response.items.length

  const filteredItems = response.items.filter((item) => {
    if (params.category && item.category !== params.category) return false
    if (params.source && item.source !== params.source) return false
    if (params.ingest_date && item.ingest_date !== params.ingest_date) return false
    return true
  })

  return {
    total: filteredItems.length,
    limit,
    offset,
    items: filteredItems.slice(offset, offset + limit),
  }
}

export const searchNewsItems = (items: NewsItem[], params: SearchNewsRequest): NewsItem[] => {
  const keyword = params.keyword.trim().toLowerCase()
  if (!keyword) return []

  return items.filter((item) => {
    if (params.category && item.category !== params.category) return false
    if (params.source && item.source !== params.source) return false
    if (params.ingest_date && item.ingest_date !== params.ingest_date) return false

    return DEFAULT_SEARCH_FIELDS.some((field) => {
      const value = item[field]
      return typeof value === 'string' && value.toLowerCase().includes(keyword)
    })
  })
}
